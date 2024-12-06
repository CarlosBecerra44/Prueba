// Archivo: src/pages/api/getPermisos.js

import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Consulta para obtener los eventos junto con los datos del usuario
    const query = `
      SELECT 
        fp.*, 
        u.nombre AS nombre_usuario
      FROM 
        formularios_papeletas fp
      JOIN 
        usuarios u 
      ON 
        fp.id_usuario = u.id
      WHERE 
        fp.eliminado = 0
      ORDER BY 
        fp.id ASC
    `;
    const result = await pool.query(query);
    const eventos = result.rows;

    // **Agregar console.log para depuración**
    console.log('Eventos con usuarios:', eventos);

    // Retornar los eventos con los datos del usuario incluidos
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}
