import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { formData, estatus } = req.body;
  const { id } = req.query;
  const estatusForm = formData.estatus ? formData.estatus : estatus;

  let connection;
  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    // Actualizar el formulario en la base de datos
    await connection.execute(
      'UPDATE formularios_faltas SET formulario = ?, estatus = ?, fecha_actualizacion = NOW() WHERE id = ?',
      [JSON.stringify(formData), estatusForm, id]
    );

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}