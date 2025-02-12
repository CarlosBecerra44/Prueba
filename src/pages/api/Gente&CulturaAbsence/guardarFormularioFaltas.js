import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { formData, tipoFormulario2, formularioNormalOExtemporaneo } = req.body;
  const { id } = req.query;
  const estatus = "Pendiente";
  const tipo = formularioNormalOExtemporaneo === "Extemporánea" ? 1 : 0;
  let connection;

  try {
    connection = await pool.getConnection();

    const fechaInicio = formData.fechaInicio ? new Date(formData.fechaInicio) : null;
    let fechaFin = formData.fechaFin ? new Date(formData.fechaFin) : null;

    // Si no hay fechas, insertar un solo registro con valores NULL
    if (!fechaInicio && !fechaFin) {
      await connection.execute(
        'INSERT INTO formularios_faltas (formulario, id_usuario, estatus, archivo, tipo, fecha_inicio, fecha_fin, extemporanea) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          JSON.stringify(formData),
          id,
          estatus,
          formData.comprobante || null,
          tipoFormulario2,
          null,
          null,
          tipo
        ]
      );
      res.status(201).json({ message: 'Formulario guardado correctamente (sin fechas)' });
      return;
    }

    // Si solo hay fechaInicio, la fechaFin será la misma
    if (fechaInicio && !fechaFin) {
      fechaFin = new Date(fechaInicio);
    }

    let currentStartDate = new Date(fechaInicio);

    while (currentStartDate <= fechaFin) {
      // Calcular el miércoles de corte de la semana de nómina
      let currentEndDate = new Date(currentStartDate);
      let dayOfWeek = currentEndDate.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
      let daysToNextWednesday = (3 - dayOfWeek + 7) % 7; // 3 representa miércoles
      currentEndDate.setDate(currentEndDate.getDate() + daysToNextWednesday);

      // Si hay fechaFin, asegurarse de no excederla
      if (currentEndDate > fechaFin) {
        currentEndDate = new Date(fechaFin);
      }

      // Insertar en la base de datos
      await connection.execute(
        'INSERT INTO formularios_faltas (formulario, id_usuario, estatus, archivo, tipo, fecha_inicio, fecha_fin, extemporanea) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          JSON.stringify(formData),
          id,
          estatus,
          formData.comprobante || null,
          tipoFormulario2,
          currentStartDate.toISOString().split('T')[0],
          currentEndDate.toISOString().split('T')[0],
          tipo
        ]
      );

      // Mover la fecha de inicio al siguiente jueves
      currentStartDate = new Date(currentEndDate);
      currentStartDate.setDate(currentStartDate.getDate() + 1);

      // Asegurar que el nuevo inicio sea jueves
      let newDayOfWeek = currentStartDate.getDay();
      if (newDayOfWeek !== 4) {
        let daysToNextThursday = (4 - newDayOfWeek + 7) % 7;
        currentStartDate.setDate(currentStartDate.getDate() + daysToNextThursday);
      }
    }

    res.status(201).json({ message: 'Formulario guardado correctamente con división por semanas de nómina' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    if (connection) connection.release();
  }
}