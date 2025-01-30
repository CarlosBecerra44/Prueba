// Archivo: src/pages/api/obtenerFormulario.js
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
    // Obtener la conexión
    connection = await pool.getConnection();

    // Consulta parametrizada para MySQL
    const [rows] = await connection.execute('SELECT * FROM vacantes WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vacante no encontrada' });
    }

    const datos = rows[0];
    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}