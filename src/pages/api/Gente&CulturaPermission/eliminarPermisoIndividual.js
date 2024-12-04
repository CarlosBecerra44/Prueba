import pool from "@/lib/db"; // Ajusta esto a tu configuración de conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;

    try {
      const result = await pool.query("UPDATE formularios_papeletas SET estatus = 'No visible' WHERE id = $1", [id]);

      if (result.rowCount > 0) {
        return res.status(200).json({ message: "Formulario eliminado correctamente" });
      } else {
        return res.status(404).json({ message: "Formulario no encontrado" });
      }
    } catch (error) {
      console.error("Error eliminando el formulario:", error);
      return res.status(500).json({ message: "Error al eliminar el formulario" });
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}