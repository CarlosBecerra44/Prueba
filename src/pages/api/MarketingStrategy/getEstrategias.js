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
    const [eventos] = await connection.query(
      'SELECT * FROM formularios_estrategias WHERE eliminado = 0 ORDER BY fecha_actualizacion DESC'
    );

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}