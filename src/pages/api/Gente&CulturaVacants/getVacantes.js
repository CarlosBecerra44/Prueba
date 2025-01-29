import pool from "@/lib/db"; // Asegúrate de que está correctamente configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    // Consulta para obtener los eventos desde la tabla 'vacantes'
    const [result] = await pool.query(`
      SELECT vacantes.*, departamentos.nombre 
      FROM vacantes
      INNER JOIN departamentos 
      ON departamentos.id = CAST(vacantes.gerencia AS UNSIGNED)
      WHERE vacantes.eliminado = 0
      ORDER BY vacantes.id DESC
    `);

    // Retorna los eventos en formato JSON
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    res.status(500).json({ message: "Error al obtener los eventos" });
  }
}