// Archivo: src/pages/api/getEstrategias.js
import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Consulta para obtener los eventos desde la tabla 'etiquetas_form'
    const [rows] = await db.query('SELECT * FROM etiquetas_form WHERE eliminado = false ORDER BY fecha_actualizacion DESC');
    
    // Retorna los eventos en formato JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}