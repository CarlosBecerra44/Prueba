import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, idUsuario } = req.body;

  if (!id || !idUsuario) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  let connection;

  try {
    // Obtener la conexión del pool
    connection = await pool.getConnection();

    // Iniciar una transacción para garantizar la atomicidad
    await connection.beginTransaction();

    // Realizar la actualización de la notificación
    const [result] = await connection.execute(
      `UPDATE notificacion
       SET leido = true
       WHERE id = ? AND id_usuario = ?`,
      [id, idUsuario]
    );

    if (result.affectedRows === 0) {
      // Si no se encuentra la notificación, devolver un error
      await connection.rollback();
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    // Confirmar la transacción
    await connection.commit();

    // Responder con el resultado de la actualización
    res.status(200).json({ success: true, message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
    if (connection) await connection.rollback(); // Revertir la transacción en caso de error
    res.status(500).json({ error: "Error al marcar la notificación como leída" });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}