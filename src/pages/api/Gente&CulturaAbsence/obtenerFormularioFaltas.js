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
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    // Ejecutar la consulta para obtener el formulario por ID
    const [rows] = await connection.execute('SELECT * FROM formularios_faltas WHERE id = ?', [id]);
    const datos = rows[0];

    // Verificar si se encontró el formulario
    if (!datos) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }

    let formularioData;

    try {
      // Intentar parsear como JSON
      formularioData = datos.formulario ? JSON.parse(datos.formulario) : null;
    } catch (error) {
      // Si falla, se trata como texto
      formularioData = datos.formulario;
    }

    const evento = {
      ...datos,
      formulario: formularioData,
    };

    res.status(200).json(evento);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}