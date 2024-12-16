import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, vacante, cantidad, gerencia, proceso_actual, ubicacion, salarioMin, salarioMax, fecha_apertura, fecha_ingreso, observaciones } = req.body;
    console.log("Salario minimo: " + salarioMin)
    console.log("Salario maximo: " + salarioMax)
    const salario = salarioMin + '-' + salarioMax;
    console.log("Salario: " + salario)

    try {
      const result = await pool.query(
        "UPDATE vacantes SET vacante = $1, cantidad = $2, gerencia = $3, proceso_actual = $4, ubicacion = $5, salario = $6, fecha_apertura = $7, fecha_ingreso = $8, observaciones = $9 WHERE id = $10",
        [vacante, cantidad, gerencia, proceso_actual, ubicacion, salario, fecha_apertura, fecha_ingreso, observaciones, id]
      );

      if (result.rowCount > 0) {
        return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      } else {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (err) {
      console.error('Error al actualizar el usuario:', err);
      return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}
