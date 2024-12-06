import pool from '@/lib/db';  // O cualquier cliente de Postgres que estés usando

export default async function handler(req, res) {
  if (req.method === "POST") {
    const {formData, emailUsuario} = req.query;
    const estatus = "Pendiente";

    try {
        const result2 = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [emailUsuario])
        if(result2.rows.length > 0) {
            const id = result2.rows[0].id;

            const result = await pool.query(
                "INSERT INTO formularios_papeletas (formulario, id_usuario, estatus) VALUES ($1, $2, $3) RETURNING *",
                [formData, id, estatus]  // Guarda el objeto JSON en la columna 'data'
              );
              res.status(200).json({ message: "Formulario guardado", result: result.rows[0] });
        } else {
            console.log("No se encontró el usuario solicitado");
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al guardar el formulario" });
    }
  } else {
    res.status(405).json({ message: "Método no permitido" });
  }
}
