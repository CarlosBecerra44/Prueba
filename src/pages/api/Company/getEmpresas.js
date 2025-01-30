import pool from '@/lib/db'; // Tu configuración de conexión a la base de datos MySQL

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let connection;
    try {
      // Obtiene una conexión del pool
      connection = await pool.getConnection();

      const [rows] = await connection.execute("SELECT * FROM empresas WHERE eliminado = 0");

      if (rows.length > 0) {
        return res.status(200).json({ success: true, users: rows });
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}