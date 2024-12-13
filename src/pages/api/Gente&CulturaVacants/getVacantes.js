// Archivo: src/pages/api/getEstrategias.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Consulta para obtener los eventos desde la tabla 'Prueba2'
    const result = await pool.query(`
        SELECT vacantes.*, departamentos.nombre
        FROM vacantes
        INNER JOIN departamentos 
        ON departamentos.id = CAST(vacantes.gerencia AS INT)
        WHERE vacantes.eliminado = 0
        ORDER BY vacantes.id DESC
      `);
    const eventos = result.rows;

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}