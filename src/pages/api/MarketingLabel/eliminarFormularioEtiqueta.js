import db from "@/lib/db"; // Ajusta esto a tu configuración de conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    console.log(id);

    try {
      // Actualiza el estatus a 'Eliminado' en lugar de eliminar el registro
      const [result] = await db.query(
        "UPDATE etiquetas_form SET estatus = 'Eliminado' WHERE id = ?",
        [id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Formulario marcado como eliminado correctamente" });
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