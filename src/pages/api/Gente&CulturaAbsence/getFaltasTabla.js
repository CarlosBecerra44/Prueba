import pool from '@/lib/db';
import { parseISO, isAfter, isBefore, addDays, setHours, startOfDay } from 'date-fns';

function determinarSemana(fechaInicio, fechaSubida) {
    if (!fechaInicio || !fechaSubida) return null;

    let fechaInicioObj, fechaSubidaObj;

    try {
        fechaInicioObj = startOfDay(parseISO(fechaInicio)); // Convertir y eliminar la hora
    } catch (error) {
        console.error("Error al parsear fechaInicio:", fechaInicio);
        return null;
    }

    try {
        fechaSubidaObj = typeof fechaSubida === 'string' 
            ? new Date(fechaSubida.replace(" ", "T")) 
            : fechaSubida;
    } catch (error) {
        console.error("Error al parsear fechaSubida:", fechaSubida);
        return null;
    }

    if (isNaN(fechaInicioObj) || isNaN(fechaSubidaObj)) return null;

    // Obtener la fecha actual sin horas
    const hoy = startOfDay(new Date());
    const diaSemana = hoy.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado

    // Calcular el jueves de la semana actual (inicio de la semana)
    const juevesSemanaActual = addDays(hoy, (4 - diaSemana + 7) % 7 - 7);
    const miercolesSemanaActual = addDays(juevesSemanaActual, 6); // Miércoles siguiente

    // Definir el corte del miércoles a las 11 AM
    const corteMiercoles11AM = setHours(startOfDay(miercolesSemanaActual), 11);

    // 📌 **Validación de la Fecha de Inicio (Semana actual o no)**
    const esFechaInicioDentroDeSemana = 
        isAfter(fechaInicioObj, addDays(juevesSemanaActual, -1)) && 
        isBefore(fechaInicioObj, addDays(miercolesSemanaActual, 1));

    // 📌 **Validación de la Fecha de Subida**
    const esFechaSubidaPosteriorAMiercoles11AM = isAfter(fechaSubidaObj, corteMiercoles11AM);

    // 📌 **Ajustar la semana según la fecha de subida y la fecha de inicio**
    if (esFechaSubidaPosteriorAMiercoles11AM) {
        // Si la fecha de subida es después de las 11 AM, asignar a la semana siguiente
        return 'siguiente'; // La semana siguiente
    } else if (isBefore(fechaSubidaObj, corteMiercoles11AM)) {
        // Si la fecha de subida es antes de las 11 AM, asignar a la semana actual
        return esFechaInicioDentroDeSemana ? 'actual' : 'pasada';
    }

    return 'pasada';
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
                e.formulario AS empresa_usuario
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
                AND (f.estatus = 'Autorizada por tu jefe directo' OR (f.estatus = 'Pendiente' AND (f.tipo = 'Aumento sueldo' OR f.tipo = 'Horas extras' OR f.tipo = 'Bonos / Comisiones')))
            ORDER BY 
                f.fecha_subida DESC;
        `;

        const [result] = await connection.execute(query);

        // Aplicamos la lógica de la semana con date-fns en JavaScript
        const eventos = result.filter(evento => {
          let fechaInicio = null;
          try {
              const formulario = JSON.parse(evento.formulario);
              fechaInicio = formulario?.fechaInicio || null; 
          } catch (error) {
              console.warn("Error al parsear JSON de formulario:", error);
          }
      
          const fechaSubida = evento.fecha_subida || null;
          const semana = determinarSemana(fechaInicio, fechaSubida);
      
          return semana === 'actual'; // Solo deja los registros de la semana actual
      });       

        res.status(200).json(eventos);
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
        res.status(500).json({ message: 'Error al obtener los eventos' });
    } finally {
        if (connection) connection.release();
    }
}