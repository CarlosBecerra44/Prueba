import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "ID de usuario requerido" });
  }

  let connection;

  try {
    // Obtener una conexión del pool
    connection = await pool.getConnection();

    // Ejecutar la consulta de actualización
    const [result] = await connection.query(
      "UPDATE usuarios SET eliminado = 1 WHERE id = ?",
      [id]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: "Usuario marcado como eliminado correctamente" });
    } else {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error marcando el usuario como eliminado:", error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  } finally {
    if (connection) connection.release(); // Liberar la conexión
  }
}