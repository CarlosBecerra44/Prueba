import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener los eventos desde la tabla 'formularios_estrategias'
    const [rows] = await connection.query(
      `SELECT 
        p.*, 
        pro.nombre AS nombre_proveedor, ma.nombre AS nombre_categoria, ca.nombre AS nombre_subcategoria, sub.nombre AS nombre_especificacion
      FROM 
        productos p
      JOIN 
        proveedores pro
      ON 
        p.proveedor_id = pro.id
      JOIN 
        tiposmaterialesprima ma
      ON 
        p.Tipo_id = ma.id
      JOIN
        categoriamaterialesprima ca
      ON
        p.Categoria_id = ca.id
      JOIN
        subcategoriamaterialesprima sub
      ON
        p.Subcategoria_id = sub.id
      WHERE
        p.eliminado = 0
      ORDER BY 
        p.id ASC`
    );

    // Retorna los eventos en formato JSON
    return res.status(200).json({ success: true, products: rows });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}