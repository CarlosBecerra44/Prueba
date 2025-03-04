import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { tipoId, categoriaId, subcategoriaId } = req.query;

  let connection;
  try {
    connection = await pool.getConnection();

    // Construir la consulta con filtros dinámicos
    let query = `
      SELECT 
        p.*, 
        pro.nombre AS nombre_proveedor, 
        ma.nombre AS nombre_categoria, 
        ca.nombre AS nombre_subcategoria, 
        sub.nombre AS nombre_especificacion,
        GROUP_CONCAT(img.ruta) AS imagenes
      FROM productos p
      JOIN proveedores pro ON p.proveedor_id = pro.id
      JOIN tiposmaterialesprima ma ON p.Tipo_id = ma.id
      JOIN categoriamaterialesprima ca ON p.Categoria_id = ca.id
      LEFT JOIN subcategoriamaterialesprima sub ON p.Subcategoria_id = sub.id
      LEFT JOIN imgproductos img ON img.producto_id = p.id
      WHERE p.eliminado = 0
    `;

    const params = [];

    if (tipoId) {
      query += ` AND p.Tipo_id = ?`;
      params.push(tipoId);
    }

    if (categoriaId) {
      query += ` AND p.Categoria_id = ?`;
      params.push(categoriaId);
    }

    if (subcategoriaId) {
      query += ` AND p.Subcategoria_id = ?`;
      params.push(subcategoriaId);
    }

    query += ` GROUP BY p.id ORDER BY p.id ASC`;

    const [rows] = await connection.query(query, params);

    // Procesar las imágenes para devolverlas como array
    rows.forEach(product => {
      product.imagenes = product.imagenes ? product.imagenes.split(",") : [];
    });

    // Retorna los productos filtrados en formato JSON
    return res.status(200).json({ success: true, products: rows });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ message: 'Error al obtener los productos' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}