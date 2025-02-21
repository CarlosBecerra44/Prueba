import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'El ID es requerido' });
  }

  let connection;

  try {
    // Obtener conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener el usuario por ID
    const [result] = await connection.execute('SELECT * FROM usuarios WHERE id = ?', [id]);

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ success: true, user: result[0] });

  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  } finally {
    if (connection) connection.release(); // Liberar la conexión
  }
}