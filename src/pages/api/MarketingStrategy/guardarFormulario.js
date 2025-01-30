import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ message: 'Datos del formulario son requeridos' });
  }

  console.log(formData);

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Guardar el formulario en la base de datos
    await connection.query(
      'INSERT INTO formularios_estrategias (formulario) VALUES (?)',
      [JSON.stringify(formData)]
    );

    res.status(201).json({ message: 'Formulario guardado correctamente' });
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