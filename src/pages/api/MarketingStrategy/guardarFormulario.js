import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  const { formData } = req.body;
  console.log(formData);

  try {
    // Guardar el formulario en la base de datos
    await pool.query('INSERT INTO formularios_estrategias (formulario) VALUES ($1)', [JSON.stringify(formData)]);

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}