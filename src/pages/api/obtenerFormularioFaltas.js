// Archivo: src/pages/api/obtenerFormulario.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  try {
    const result = await pool.query('SELECT formulario FROM formularios_faltas WHERE id = $1', [id]);
    const datos = result.rows[0]?.formulario || {};
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
}