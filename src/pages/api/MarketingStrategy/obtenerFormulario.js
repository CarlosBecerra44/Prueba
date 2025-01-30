import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  let connection;
  try {
    // Obtención de la conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener el formulario desde la base de datos
    const [rows] = await connection.query('SELECT formulario FROM formularios_estrategias WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }

    const datos = rows[0].formulario;
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  } finally {
    if (connection) {
      // Liberar la conexión
      connection.release();
    }
  }
}