import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  // Obtén el cuerpo de la solicitud directamente
  const formData = req.body;

  console.log(formData);
  if (!formData) {
    return res.status(400).json({ message: 'Datos del formulario son requeridos' });
  }

  let connection;

  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    const { estatus, firmas } = formData;

    // Guardar el formulario en la base de datos
    const [result] = await connection.query(
      'UPDATE etiquetas_form SET datos_formulario = ?, estatus = ?, fecha_actualizacion = CURRENT_TIMESTAMP, firmas = ? WHERE id = ?',
      [JSON.stringify(formData), estatus, firmas, id]
    );

    // Verificar si la actualización fue exitosa
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