import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let connection;

  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    const query = `
      SELECT 
          f.*, 
          u.*, 
          f.id AS id_papeleta, 
          f.formulario AS formulario_usuario,
          d.nombre AS nombre_departamento,
          e.formulario AS empresa_usuario,
          CONVERT_TZ(f.fecha_subida, '+00:00', '+06:00') AS fecha_subida, 
          CONVERT_TZ(f.fecha_actualizacion, '+00:00', '+06:00') AS fecha_actualizacion,
          CONVERT_TZ(f.fecha_inicio, '+00:00', '+06:00') AS fecha_inicio,
          CONVERT_TZ(f.fecha_fin, '+00:00', '+06:00') AS fecha_fin
      FROM 
          formularios_faltas f
      JOIN 
          usuarios u
      ON 
          f.id_usuario = u.id 
          AND f.eliminado = 0 
          AND (f.estatus != 'Pendiente' AND f.estatus != 'No autorizada por tu jefe directo')
          AND (f.tipo != 'Aumento sueldo' AND f.tipo != 'Horas extras' AND f.tipo != 'Bonos / Comisiones' AND f.tipo != 'Faltas' AND f.tipo != 'Suspension')
      JOIN 
          departamentos d
      ON 
          u.departamento_id = d.id
      JOIN 
          empresas e
      ON
          u.empresa_id = e.id
      ORDER BY 
          f.fecha_actualizacion DESC;
    `;
    
    const [result] = await connection.execute(query); // Ejecuta la consulta utilizando la conexión obtenida
    const eventos = result;

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