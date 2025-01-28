import pool from "@/lib/db"; // Configuración de tu conexión a la BD

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { formData2 } = req.body;

  try {
    // Insertar el registro del evento
    const [result] = await pool.execute(
      "INSERT INTO registroeventos (tipo, descripcion, id_usuario, id_departamento) VALUES (?, ?, ?, ?) ",
      [formData2.tipo, formData2.descripcion, formData2.id, formData2.dpto]
    );

    const idEvento = result.insertId;

    // Insertar las notificaciones
    await pool.execute(
      `INSERT INTO notificacion (id_evento, id_usuario)
       SELECT ?, id
       FROM usuarios
       WHERE departamento_id = ? AND id != ?`,
      [idEvento, formData2.dpto, formData2.id]
    );

    res.status(201).json({ message: "Evento guardado correctamente" });
  } catch (error) {
    console.error("Error guardando el evento:", error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
}