import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

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
          AND f.eliminado = 0 
          AND f.estatus = 'Autorizada'
      JOIN 
          departamentos d
      ON 
          u.departamento_id = d.id
      ORDER BY 
          f.fecha_subida DESC;
    `;
    
    const [result] = await pool.execute(query); // Se usa pool.execute para ejecutar la consulta en MySQL
    const eventos = result;

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}