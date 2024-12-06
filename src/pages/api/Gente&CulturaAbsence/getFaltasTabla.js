// Archivo: src/pages/api/getEstrategias.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Consulta para obtener los eventos desde la tabla 'Prueba2'
    const query = `
      SELECT 
        f.*, u.*, d.nombre AS nombre_departamento
      FROM 
        formularios_faltas f
      JOIN 
        usuarios u
      ON 
        f.id_usuario = u.id AND f.eliminado = 0
      JOIN 
        departamentos d
      ON u.departamento_id = d.id
      ORDER BY 
        f.fecha_subida DESC
    `;
    const result = await pool.query(query);
    const eventos = result.rows;

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}