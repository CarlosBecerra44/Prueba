import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, vacante, cantidad, gerencia, proceso_actual, ubicacion, salarioMin, salarioMax, fecha_apertura, fecha_ingreso, observaciones } = req.body;

    // Generar el rango de salario
    const salario = `${salarioMin}-${salarioMax}`;
    console.log("Salario mínimo:", salarioMin);
    console.log("Salario máximo:", salarioMax);
    console.log("Rango de salario:", salario);

    let connection;

    try {
      // Obtener la conexión
      connection = await pool.getConnection();

      // Consulta parametrizada para MySQL
      const [result] = await connection.execute(
        `UPDATE vacantes 
         SET vacante = ?, 
             cantidad = ?, 
             gerencia = ?, 
             proceso_actual = ?, 
             ubicacion = ?, 
             salario = ?, 
             fecha_apertura = ?, 
             fecha_ingreso = ?, 
             observaciones = ? 
         WHERE id = ?`,
        [vacante, cantidad, gerencia, proceso_actual, ubicacion, salario, fecha_apertura, fecha_ingreso, observaciones, id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Vacante actualizada exitosamente' });
      } else {
        return res.status(404).json({ message: 'Vacante no encontrada' });
      }
    } catch (err) {
      console.error('Error al actualizar la vacante:', err);
      return res.status(500).json({ message: 'Error al actualizar la vacante' });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ message: 'Método no permitido' });
  }
}