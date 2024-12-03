import pool from "@/lib/db"; // Configuración de tu conexión a la BD

export default async function handler(req, res) {
  if (req.method === "GET") {

    const { id } = req.query;

    console.log("ID USUARIO: " + id)

    try {
      

      const result = await pool.query('SELECT * FROM registroeventos WHERE id_usuario = $1 ORDER BY fecha DESC', [id]);

      // Si usas PostgreSQL (pg)
      const notificaciones = result.rows || result;

      res.status(200).json(notificaciones);
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      res.status(500).json({ error: "Error al obtener las notificaciones" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
