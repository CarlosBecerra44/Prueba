import pool from '@/lib/db'; // Asegúrate de que la conexión esté configurada para MySQL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  const { formData } = req.body;
  console.log(formData);

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Guardar el formulario en la base de datos
    const [result] = await connection.query(
      'UPDATE formularios_estrategias SET formulario = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(formData), id]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Formulario guardado correctamente' });
    } else {
      res.status(404).json({ message: 'Formulario no encontrado' });
    }
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}