import pool from "@/lib/db"; // Configuración de tu conexión a la BD

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { formData2 } = req.body;
  let connection;

  try {
    // Obtener la conexión del pool
    connection = await pool.getConnection();
    
    await connection.beginTransaction(); // Iniciar transacción

    // Insertar el registro del evento
    const [result] = await connection.execute(
      "INSERT INTO registroeventos (tipo, descripcion, id_usuario, id_departamento) VALUES (?, ?, ?, ?)",
      [formData2.tipo, formData2.descripcion, formData2.id, formData2.dpto]
    );

    const idEvento = result.insertId;

    // Insertar las notificaciones
    await connection.execute(
      `INSERT INTO notificacion (id_evento, id_usuario)
       SELECT ?, id
       FROM usuarios
       WHERE departamento_id = ? AND id != ?`,
      [idEvento, formData2.dpto, formData2.id]
    );

    await connection.commit(); // Confirmar la transacción

    res.status(201).json({ message: "Evento guardado correctamente" });
  } catch (error) {
    console.error("Error guardando el evento:", error);
    if (connection) await connection.rollback(); // Revertir en caso de error
    res.status(500).json({ message: "Error en el servidor", error });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}