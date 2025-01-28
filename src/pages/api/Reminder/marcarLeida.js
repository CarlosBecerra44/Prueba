import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, idUsuario } = req.body;

    try {
      const [result] = await pool.execute(
        `UPDATE notificacion
         SET leido = true
         WHERE id = ? AND id_usuario = ?`,
        [id, idUsuario]
      );
      
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: "Error al marcar la notificación como leída" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}