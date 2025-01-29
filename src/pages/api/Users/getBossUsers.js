import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    // Consulta para obtener los usuarios donde jefe_directo sea el ID proporcionado
    const [result] = await pool.query('SELECT * FROM usuarios WHERE jefe_directo = ?', [id]);

    if (result.length > 0) {
      return res.status(200).json({ success: true, users: result });
    } else {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
}