// Archivo: src/pages/api/getEstrategias.js
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { departamento } = req.query;

  if(departamento != null) {
    try {
        // Consulta para obtener los eventos desde la tabla 'Prueba2'
        const result = await pool.query('SELECT * FROM usuarios WHERE departamento_id = $1', [departamento]);
        if (result.rows.length > 0) {
            const users = result.rows;
         
            return res.status(200).json({ success: true, users });
          }
        else {
          return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
      }
  } else {
    try {
        // Consulta para obtener los eventos desde la tabla 'Prueba2'
        const result = await pool.query('SELECT * FROM usuarios WHERE (departamento_id = 7 OR departamento_id = 11)');
        if (result.rows.length > 0) {
            const users = result.rows;
         
            return res.status(200).json({ success: true, users });
          }
        else {
          return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
      }
  }

  
}