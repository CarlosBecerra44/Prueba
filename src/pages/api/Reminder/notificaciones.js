import pool from "@/lib/db"; // Configuración de tu conexión a la BD

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID de usuario es requerido" });
  }

  const query = `
    SELECT ne.id, ne.descripcion, nu.leido, ne.fecha, ne.tipo, nu.id AS id_notificacion
    FROM notificacion nu
    JOIN registroeventos ne ON nu.id_evento = ne.id
    WHERE nu.id_usuario = ? AND nu.leido = false
    ORDER BY ne.fecha DESC
  `;

  let connection;

  try {
    // Obtener la conexión
    connection = await pool.getConnection();

    // Ejecutar la consulta con la conexión obtenida
    const [result] = await connection.execute(query, [id]);

    // Enviar la respuesta con las notificaciones
    res.status(200).json(result || []);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener las notificaciones" });
  } finally {
    // Liberar la conexión
    if (connection) {
      connection.release();
    }
  }
}