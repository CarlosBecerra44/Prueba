import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, estatus } = req.body;

    if (!id || !estatus) {
      return res.status(400).json({ message: 'ID y estatus son requeridos' });
    }

    let connection;

    try {
      // Obtener la conexión
      connection = await pool.getConnection();

      // Consulta parametrizada para MySQL
      const [result] = await connection.execute(
        "UPDATE vacantes SET proceso_actual = ? WHERE id = ?",
        [estatus, id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Vacante actualizada exitosamente' });
      } else {
        return res.status(404).json({ message: 'Vacante no encontrada' });
      }
    } catch (err) {
      console.error('Error al actualizar la vacante:', err);
      return res.status(500).json({ message: 'Error al actualizar la vacante' });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}