import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  let connection;

  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    const query = `
      SELECT 
        u.*, 
        d.nombre AS nombre_dpto, 
        d.id AS id_dpto, 
        e.formulario AS empresa_usuario
      FROM 
        usuarios u
      JOIN 
        departamentos d 
      ON 
        u.departamento_id = d.id AND u.eliminado = 0
      JOIN 
        empresas e
      ON 
        u.empresa_id = e.id
      ORDER BY 
        u.id ASC
    `;

    // Ejecutar la consulta usando la conexión
    const [rows] = await connection.query(query);

    if (rows.length > 0) {
      return res.status(200).json({ success: true, users: rows });
    } else {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  } finally {
    if (connection) connection.release(); // Liberar la conexión en el `finally`
  }
}