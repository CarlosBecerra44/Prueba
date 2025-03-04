import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Consulta para agrupar productos en una sola fila por pedido
    const [rows] = await connection.query(
      `SELECT 
      cmddetalle.id,
        cmddetalle.cmd_id, 
        GROUP_CONCAT(productos.nombre ORDER BY productos.nombre SEPARATOR ', ') AS productosPedidos
      FROM cmddetalle
      JOIN productos ON cmddetalle.producto_id = productos.id
      GROUP BY cmddetalle.cmd_id
      ORDER BY cmddetalle.cmd_id ASC`
    );      

    // Retornar pedidos agrupados en formato JSON
    return res.status(200).json({ success: true, pedidos: rows });
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    res.status(500).json({ message: 'Error al obtener los pedidos' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}