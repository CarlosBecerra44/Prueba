import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { nombre, proveedor, categoriaGeneral, subcategoria, especificacion, medicion, codigo, costo, compraMinima, descripcion } = req.body;

  let connection;

  try {
    // Obtener la conexión del pool
    connection = await pool.getConnection();

    // Guardar el nuevo usuario en la base de datos
    await connection.execute(
      'INSERT INTO productos (nombre, proveedor_id, Tipo_id, Categoria_id, Subcategoria_id, medicion, codigo, costo, cMinima, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, proveedor, categoriaGeneral, subcategoria, especificacion, medicion, codigo, costo, compraMinima, descripcion]
    );

    console.log({ message: 'Producto registrado' });

    res.status(201).json({ success: true }); // Omitir la contraseña al retornar el usuario
  } catch (error) {
    console.error('Error registrando el producto:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}