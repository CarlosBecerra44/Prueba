import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  const { vacante, cantidad, gerencia, proceso_actual, ubicacion, salarioMin, salarioMax, fecha_apertura, fecha_ingreso, observaciones } = req.body;
  const salario = salarioMin + '-' + salarioMax;
  const ingreso = fecha_ingreso || null;

  try {
    // Guardar el formulario en la base de datos
    await pool.query('INSERT INTO vacantes (vacante, cantidad, gerencia, proceso_actual, ubicacion, salario, fecha_apertura, fecha_ingreso, observaciones) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [vacante, cantidad, gerencia, proceso_actual, ubicacion, salario, fecha_apertura, ingreso, observaciones]);

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}