import pool from "@/lib/db"; // Configuración de tu conexión a la BD

export default async function handler(req, res) {
  if (req.method === "GET") {

    const { id } = req.query;

    try {
      const result = await pool.query(
        `SELECT ne.id, ne.descripcion, nu.leido, ne.fecha, ne.tipo, nu.id AS id_notificacion
         FROM notificacion nu
         JOIN registroeventos ne ON nu.id_evento = ne.id
         WHERE nu.id_usuario = $1 AND nu.leido = false
         ORDER BY ne.fecha DESC`,
          [id]);
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
