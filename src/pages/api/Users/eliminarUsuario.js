import pool from "@/lib/db"; // Ajusta esto a tu configuración de conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    console.log(id);

    try {
      // Actualiza la columna 'eliminado' en lugar de eliminar el registro
      const [result] = await pool.query(
        "UPDATE usuarios SET eliminado = 1 WHERE id = ?",
        [id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Usuario marcado como eliminado correctamente" });
      } else {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error marcando el usuario como eliminado:", error);
      return res.status(500).json({ message: "Error en el servidor" });
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}