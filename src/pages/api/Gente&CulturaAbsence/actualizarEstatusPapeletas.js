import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, estatus } = req.query;

    try {
      const result = await pool.query(
        "UPDATE formularios_faltas SET estatus = $1, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = $2",
        [estatus, id]
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
