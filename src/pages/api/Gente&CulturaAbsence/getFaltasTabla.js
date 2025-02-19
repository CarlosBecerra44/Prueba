import pool from '@/lib/db';
import { parseISO, isAfter, isBefore, startOfDay, endOfDay, subDays, addDays, format, isEqual } from 'date-fns';

function determinarSemanaAnterior(fechaInicio) {
  if (!fechaInicio) {
      console.log("Fecha de inicio es NULL, asignado a la semana anterior.");
      return 'semana_anterior';
  }

  let fechaInicioObj = startOfDay(new Date(fechaInicio)); // Convertir a fecha sin hora
  if (isNaN(fechaInicioObj)) return null;

  // 📌 **Obtener el jueves de la semana en curso**
  const hoy = new Date();
  const diaSemana = hoy.getDay();
  const juevesSemanaActual = diaSemana >= 4
      ? startOfDay(addDays(hoy, 4 - diaSemana))
      : startOfDay(addDays(hoy, -3 - diaSemana));

  // 📌 **Calcular la semana anterior de nómina (jueves - miércoles)**
  const inicioSemanaAnterior = subDays(juevesSemanaActual, 7);
  const finSemanaAnterior = endOfDay(addDays(inicioSemanaAnterior, 6));

  // 📌 **Comparación de fechas**
  if (isAfter(fechaInicioObj, inicioSemanaAnterior) && isBefore(fechaInicioObj, finSemanaAnterior)) {
      console.log("Asignado a la semana anterior.");
      return 'semana_anterior';
  }

  // 📌 **Incluir el jueves de la semana de nómina como parte de la semana anterior**
  if (isEqual(fechaInicioObj, inicioSemanaAnterior)) {
      console.log("Asignado al inicio de la semana anterior.");
      return 'semana_anterior';
  }

  console.log("No pertenece a la semana anterior.");
  return null;
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    let connection;

    try {
        connection = await pool.getConnection();

        const query = `
            SELECT 
                f.*, 
                u.*, 
                f.id AS id_papeleta, 
                f.formulario AS formulario_usuario,
                d.nombre AS nombre_departamento,
                e.formulario AS empresa_usuario,
                f.fecha_inicio,
                CONVERT_TZ(f.fecha_subida, '+00:00', '+06:00') AS fecha_subida, 
                CONVERT_TZ(f.fecha_actualizacion, '+00:00', '+06:00') AS fecha_actualizacion,
                CONVERT_TZ(f.fecha_inicio, '+00:00', '+06:00') AS fecha_inicio,
                CONVERT_TZ(f.fecha_fin, '+00:00', '+06:00') AS fecha_fin
            FROM 
                formularios_faltas f
            JOIN 
                usuarios u ON f.id_usuario = u.id 
            JOIN 
                departamentos d ON u.departamento_id = d.id
            JOIN 
                empresas e ON u.empresa_id = e.id
            WHERE 
                f.eliminado = 0 
                AND f.extemporanea = 0
                AND (f.estatus = 'Autorizada por tu jefe directo' 
                OR (f.estatus = 'Pendiente' AND f.tipo IN ('Aumento sueldo', 'Horas extras', 'Bonos / Comisiones', 'Faltas', 'Suspension')))
            ORDER BY 
                f.fecha_inicio DESC;
        `;

        const [result] = await connection.execute(query);

        // Aplicamos la lógica de la semana con date-fns en JavaScript
        const eventos = result.filter(evento => determinarSemanaAnterior(evento.fecha_inicio) === 'semana_anterior');

        res.status(200).json(eventos);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
    } finally {
        if (connection) connection.release();
    }
}