import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID requerido' });
  }

  let connection;

  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Ejecutar la consulta
    const [users] = await connection.query('SELECT * FROM usuarios WHERE jefe_directo = ?', [id]);

    if (users.length > 0) {
      return res.status(200).json({ success: true, users });
    } else {
      return res.status(404).json({ success: false, message: 'No se encontraron usuarios con este jefe directo' });
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  } finally {
    if (connection) connection.release(); // Liberar la conexión
  }
}