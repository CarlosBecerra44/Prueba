import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { tipo, marca, modelo, serial, etiquetas, fecha, observacion } = req.body;

    try {
      // Inserta los datos en la tabla `inventario`
      const query = `
        INSERT INTO inventario (tipo, marca, modelo, serie, etiqueta, fecha, observacion) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [tipo, marca, modelo, serial, JSON.stringify(etiquetas), fecha, observacion];

      const result = await pool.query(query, values);

      res.status(200).json({ success: true, data: result[0] });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error al agregar el equipo' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}