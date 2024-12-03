import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, nombre, apellidos, correo, numero_empleado, puesto, departamento_id, rol } = req.body;

    try {
      const result = await pool.query(
        "UPDATE usuarios SET nombre = $1, apellidos = $2, correo = $3, numero_empleado = $4, puesto = $5, departamento_id = $6, rol = $7 WHERE id = $8",
        [nombre, apellidos, correo, numero_empleado, puesto, departamento_id, rol, id]
      );

      if (result.rowCount > 0) {
        return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}
