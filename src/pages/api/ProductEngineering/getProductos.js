import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  let connection;
  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Consulta para obtener productos junto con sus imágenes
    const [rows] = await connection.query(
      `SELECT 
        p.*, 
        pro.nombre AS nombre_proveedor, 
        ma.nombre AS nombre_categoria, 
        ca.nombre AS nombre_subcategoria, 
        sub.nombre AS nombre_especificacion,
        GROUP_CONCAT(img.ruta SEPARATOR ',') AS imagenes
      FROM 
        productos p
      JOIN 
        proveedores pro ON p.proveedor_id = pro.id
      JOIN 
        tiposmaterialesprima ma ON p.Tipo_id = ma.id
      JOIN
        categoriamaterialesprima ca ON p.Categoria_id = ca.id
      LEFT JOIN
        subcategoriamaterialesprima sub ON p.Subcategoria_id = sub.id
      LEFT JOIN
        imgproductos img ON img.producto_id = p.id  -- Traer imágenes de imgproductos
      WHERE
        p.eliminado = 0
      GROUP BY 
        p.id
      ORDER BY 
        p.id ASC`
    );

    // Convertir la lista de imágenes en un array para cada producto
    rows.forEach(product => {
      product.imagenes = product.imagenes ? product.imagenes.split(",") : [];
    });

    // Retornar los productos con imágenes en formato JSON
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