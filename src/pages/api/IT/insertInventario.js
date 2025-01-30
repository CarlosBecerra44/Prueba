import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tipo, marca, modelo, serial, etiquetas, fecha, observacion } = req.body;

    let connection;

    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();

      // Inserta los datos en la tabla `inventario`
      const query = `
        INSERT INTO inventario (tipo, marca, modelo, serie, etiqueta, fecha, observacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [tipo, marca, modelo, serial, JSON.stringify(etiquetas), fecha, observacion];

      // Ejecutar la consulta
      const [result] = await connection.query(query, values);

      res.status(200).json({ success: true, data: result });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al agregar el equipo' });
    } finally {
      // Liberar la conexión
      if (connection) {
        connection.release();
      }
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}