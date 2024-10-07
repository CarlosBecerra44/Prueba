import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  // Obtén el cuerpo de la solicitud directamente
  const formData = req.body;

  if (!formData) {
    return res.status(400).json({ message: 'Datos del formulario son requeridos' });
  }

  try {
    // Guardar el formulario en la base de datos
    await pool.query('UPDATE etiquetas_form SET datos_formulario = $1 WHERE id = $2', [JSON.stringify(formData), id]);

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}
