import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    // Consulta para obtener los eventos junto con los datos del usuario
    const query = "SELECT * FROM formularios_papeletas WHERE id_usuario = ? AND estatus != 'No visible' ORDER BY id ASC";
    const [result] = await pool.execute(query, [id]);

    // Retornar los eventos con los datos del usuario incluidos
    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
}