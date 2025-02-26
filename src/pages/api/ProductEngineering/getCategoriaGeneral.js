import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener los eventos desde la tabla 'formularios_estrategias'
    const [rows] = await connection.query(
      `SELECT * FROM tiposmaterialesprima ORDER BY id ASC`
    );

    // Retorna los eventos en formato JSON
    return res.status(200).json({ success: true, categorias: rows });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}