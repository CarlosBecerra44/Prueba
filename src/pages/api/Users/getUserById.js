import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id } = req.body;

    try {
      const query = 'SELECT * FROM usuarios WHERE id = ?';
      const [result] = await pool.query(query, [id]);

      if (result.length > 0) {
        const user = result[0];

        return res.status(200).json({ success: true, user });
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