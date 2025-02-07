import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id, nombre, apellidos, correo, numero_empleado, puesto, departamento_id, rol, telefono, fecha_ingreso, jefe_directo, empresa_id, planta } = req.body;
  const jefe = jefe_directo || null;

  let connection;

  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Ejecutar la consulta SQL para actualizar los datos del usuario
    const [result] = await connection.query(
      `UPDATE usuarios 
       SET nombre = ?, apellidos = ?, correo = ?, numero_empleado = ?, 
           puesto = ?, departamento_id = ?, rol = ?, telefono = ?, 
           fecha_ingreso = ?, jefe_directo = ?, empresa_id = ?, planta = ?
       WHERE id = ?`,
      [nombre, apellidos, correo, numero_empleado, puesto, departamento_id, rol, telefono, fecha_ingreso, jefe, empresa_id, planta, id]
    );

    // Verificar si se actualizó el usuario
    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Usuario actualizado exitosamente' });
    } else {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ success: false, message: 'Error al actualizar el usuario' });
  } finally {
    if (connection) connection.release(); // Liberar la conexión
  }
}