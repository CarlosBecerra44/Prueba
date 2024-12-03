import pool from '@/lib/db';

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
  
  try {
    // Guardar el formulario en la base de datos
    await pool.query('UPDATE formularios_estrategias SET formulario = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2', [JSON.stringify(formData), id]);

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}