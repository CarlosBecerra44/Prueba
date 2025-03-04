import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID del producto requerido' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT ruta FROM imgproductos WHERE producto_id = ?`, [id]);

    const imagenes = rows.map(row => row.ruta);
    
    return res.status(200).json({ success: true, imagenes });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    res.status(500).json({ message: 'Error al obtener imágenes' });
  } finally {
    if (connection) connection.release();
  }
}