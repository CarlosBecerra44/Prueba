import pool from "@/lib/db"; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, estatus, comentarios } = req.body;

    let connection;
    try {
      // Obtiene una conexión del pool
      connection = await pool.getConnection();

      const [result] = await connection.execute(
        "UPDATE formularios_faltas SET estatus = ?, fecha_actualizacion = NOW(), comentarios = ? WHERE id = ?",
        [estatus, comentarios, id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}