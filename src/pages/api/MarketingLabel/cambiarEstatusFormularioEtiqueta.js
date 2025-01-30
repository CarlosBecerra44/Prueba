import pool from '@/lib/db'; // Asegúrate de tener tu conexión a la base de datos configurada.

export default async function handler(req, res) {
  const { id, nuevoEstatus } = req.body;

  if (req.method === 'POST') {
    let connection;

    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();

      // Actualizamos el estatus en la base de datos MySQL
      const [resultado] = await connection.query(
        'UPDATE etiquetas_form SET estatus = ? WHERE id = ?',
        [nuevoEstatus, id]
      );

      if (resultado.affectedRows === 1) {
        res.status(200).json({ message: 'Estatus actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Formulario no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el estatus:', error);
      res.status(500).json({ message: 'Error al actualizar el estatus' });
    } finally {
      // Liberar la conexión
      if (connection) {
        connection.release();
      }
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}