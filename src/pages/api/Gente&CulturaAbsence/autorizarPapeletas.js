import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;
  let connection;

  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    const query = `
      SELECT 
          f.*, 
          u.*, 
          f.id AS id_papeleta, 
          d.nombre AS nombre_departamento,
          CONVERT_TZ(f.fecha_subida, '+00:00', '+06:00') AS fecha_subida, 
          CONVERT_TZ(f.fecha_actualizacion, '+00:00', '+06:00') AS fecha_actualizacion
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
          f.id_usuario != ? AND u.jefe_directo = ? AND f.eliminado = 0 AND f.estatus = 'Pendiente' AND f.tipo NOT IN ('Aumento sueldo', 'Horas extras', 'Bonos / Comisiones', 'Faltas', 'Suspension')
      ORDER BY 
          f.fecha_subida DESC;
    `;
    
    const [result] = await connection.execute(query, [id, id]);

    // Procesamos el campo 'datos_formulario' (suponiendo que es un campo JSON)
    const eventos = result.map(evento => {
      return {
        ...evento,
        datos_formulario: evento.datos_formulario ? JSON.parse(evento.datos_formulario) : null, // Convertir a objeto si es JSON
      };
    });

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}