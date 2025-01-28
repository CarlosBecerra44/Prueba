import pool from '@/lib/db'; // Tu configuración de conexión a la base de datos MySQL

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query("SELECT * FROM empresas WHERE eliminado = 0");

      if (rows.length > 0) {
        return res.status(200).json({ success: true, users: rows });
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}