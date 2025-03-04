import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { productIds, userId } = req.body; // Recibes los IDs de los productos seleccionados y el ID del usuario.

  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: 'Los IDs de los productos son requeridos' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'El ID del usuario es requerido' });
  }

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // 1. Crear el pedido en la tabla 'cmd'
    const [cmdResult] = await connection.query(
      'INSERT INTO cmd (created_for) VALUES (?)',
      [userId]
    );

    const cmdId = cmdResult.insertId; // Obtener el ID del pedido recién creado

    // 2. Insertar los productos seleccionados en la tabla intermedia
    const values = productIds.map((productId) => [cmdId, productId]);

    await connection.query(
      'INSERT INTO cmddetalle (cmd_id, producto_id) VALUES ?',
      [values]
    );

    res.status(201).json({ success: true, message: 'Pedido guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el pedido:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}