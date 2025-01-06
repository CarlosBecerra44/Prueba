import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  const { formData, estatus } = req.body;
  const { id } = req.query;
  const estatusForm = formData.estatus ? formData.estatus : estatus;

  try {
    // Guardar el formulario en la base de datos
    await pool.query('UPDATE formularios_faltas SET formulario = $1, estatus = $2, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $3', [JSON.stringify(formData), estatusForm, id]);

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}