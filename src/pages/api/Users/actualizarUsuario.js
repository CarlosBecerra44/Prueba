import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Extrae los campos del cuerpo de la solicitud
    const { id, nombre, apellidos, correo, numero_empleado, puesto, departamento_id, rol, telefono, fecha_ingreso, jefe_directo, empresa_id } = req.body;
    const jefe = jefe_directo || null; // Si jefe_directo está vacío, se asigna null

    try {
      // Ejecuta la consulta SQL para actualizar los datos del usuario
      const [result] = await pool.query(
        "UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, numero_empleado = ?, puesto = ?, departamento_id = ?, rol = ?, telefono = ?, fecha_ingreso = ?, jefe_directo = ?, empresa_id = ? WHERE id = ?",
        [nombre, apellidos, correo, numero_empleado, puesto, departamento_id, rol, telefono, fecha_ingreso, jefe, empresa_id, id]
      );

      // Verifica si la actualización fue exitosa
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  } else {
    // Si el método no es POST, responde con un error
    return res.status(405).json({ message: 'Método no permitido' });
  }
}