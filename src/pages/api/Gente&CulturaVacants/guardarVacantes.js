import pool from "@/lib/db"; // Asegúrate de que está correctamente configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const {
    vacante,
    cantidad,
    gerencia,
    proceso_actual,
    ubicacion,
    salarioMin,
    salarioMax,
    fecha_apertura,
    fecha_ingreso,
    observaciones,
  } = req.body;

  const salario = `${salarioMin}-${salarioMax}`;
  const ingreso = fecha_ingreso || null;

  let connection;

  try {
    // Obtener la conexión
    connection = await pool.getConnection();

    // Guardar el formulario en la base de datos
    const [result] = await connection.execute(
      "INSERT INTO vacantes (vacante, cantidad, gerencia, proceso_actual, ubicacion, salario, fecha_apertura, fecha_ingreso, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [vacante, cantidad, gerencia, proceso_actual, ubicacion, salario, fecha_apertura, ingreso, observaciones]
    );

    res.status(201).json({ message: "Formulario guardado correctamente", insertId: result.insertId });
  } catch (error) {
    console.error("Error guardando el formulario:", error);
    res.status(500).json({ message: "Error en el servidor" });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}