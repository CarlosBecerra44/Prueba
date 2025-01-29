import pool from "@/lib/db"; // Asegúrate de que la conexión está configurada para MySQL

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID es requerido" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE formularios_estrategias SET eliminado = 1 WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Formulario eliminado correctamente" });
    } else {
      return res.status(404).json({ message: "Formulario no encontrado" });
    }
  } catch (error) {
    console.error("Error eliminando el formulario:", error);
    return res.status(500).json({ message: "Error al eliminar el formulario" });
  }
}