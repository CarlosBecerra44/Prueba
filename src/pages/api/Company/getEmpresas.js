import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
   
    try {
      const query = "SELECT * FROM empresas WHERE eliminado = 0"
      const result = await pool.query(query);

      if (result.rows.length > 0) {
          const users = result.rows;
       
          return res.status(200).json({ success: true, users });
        }
      else {
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