import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id, nombre, proveedor, categoriaGeneral, subcategoria, especificacion, medicion, codigo, costo, compraMinima, descripcion } = req.body;

  let connection;

  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Ejecutar la consulta SQL para actualizar los datos del usuario
    const [result] = await connection.query(
      `UPDATE productos 
       SET nombre = ?, proveedor_id = ?, Tipo_id = ?, Categoria_id = ?, 
           Subcategoria_id = ?, codigo = ?, costo = ?, cMinima = ?, 
           medicion = ?, descripcion = ?
       WHERE id = ?`,
      [nombre, proveedor, categoriaGeneral, subcategoria, especificacion, codigo, costo, compraMinima, medicion, descripcion, id]
    );

    // Verificar si se actualizó el usuario
    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Producto actualizado exitosamente' });
    } else {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el producto' });
  } finally {
    if (connection) connection.release(); // Liberar la conexión
  }
}