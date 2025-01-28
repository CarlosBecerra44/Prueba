// Archivo: src/pages/api/getEstrategias.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    const query = `
      SELECT 
          f.*, 
          u.*, 
          f.id AS id_papeleta, 
          d.nombre AS nombre_departamento
      FROM 
          formularios_faltas f
      JOIN 
          usuarios u
      ON 
          f.id_usuario = u.id 
      JOIN 
          departamentos d
      ON 
          u.departamento_id = d.id
      WHERE 
          f.id_usuario = $1 AND (f.tipo = 'Aumento sueldo' OR f.tipo = 'Horas extras' OR f.tipo = 'Bonos / Comisiones') AND f.eliminado = 0
      ORDER BY 
          f.fecha_subida DESC;
    `;
    const result = await pool.query(query, [id]);
    const eventos = result.rows;

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}