import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Iniciando consulta a la base de datos...');

      // Consulta para obtener todos los registros de inventario
      const [rows] = await pool.query('SELECT * FROM inventario');
      
      console.log('Resultado de la consulta:', rows);

      // Mapeamos los resultados, asegurándonos de que el campo 'etiquetas' esté correctamente parseado
      const inventario = rows.map((item) => ({
        ...item,
        etiquetas: item.etiquetas ? JSON.parse(item.etiquetas) : [], // Asegúrate de manejar null o undefined
      }));

      res.status(200).json(inventario);
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
      res.status(500).json({ error: 'Error al obtener inventario' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}