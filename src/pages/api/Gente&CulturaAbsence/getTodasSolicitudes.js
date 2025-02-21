import { Op, literal } from "sequelize";
import FormulariosFaltas from "@/models/FormulariosFaltas";
import Usuario from "@/models/Usuarios";
import Departamento from "@/models/Departamentos";
import Empresa from "@/models/Empresas";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    // Consulta con Sequelize
    const eventos = await FormulariosFaltas.findAll({
      where: {
        eliminado: 0,
        tipo: {
          [Op.in]: [
            "Aumento sueldo",
            "Horas extras",
            "Bonos / Comisiones",
            "Faltas",
            "Suspension",
          ],
        },
      },
      attributes: [
        "id",
        "estatus",
        "archivo",
        "eliminado",
        "comentarios",
        "tipo",
        "extemporanea",
        "id_usuario",
        ["formulario", "formulario_usuario"],
        [literal("CONVERT_TZ(fecha_subida, '+00:00', '+06:00')"), "fecha_subida"],
        [literal("CONVERT_TZ(fecha_actualizacion, '+00:00', '+06:00')"), "fecha_actualizacion"],
        [literal("CONVERT_TZ(fecha_inicio, '+00:00', '+06:00')"), "fecha_inicio"],
        [literal("CONVERT_TZ(fecha_fin, '+00:00', '+06:00')"), "fecha_fin"],
      ],
      include: [
        {
          model: Usuario,
          attributes: ["id", "numero_empleado", "nombre", "apellidos", "puesto", "jefe_directo"],
          include: [
            {
              model: Departamento,
              attributes: [["nombre", "nombre_departamento"]],
            },
            {
              model: Empresa,
              attributes: [["formulario", "empresa_usuario"]],
            },
          ],
        },
      ],
      order: [[literal("fecha_inicio"), "DESC"]],
      raw: true, // Devuelve los datos en formato plano
    });

    if (!eventos || eventos.length === 0) {
      return res.status(404).json({ message: "No se encontraron eventos" });
    }

    // Mapeamos los resultados para ajustar nombres y valores
    const result = eventos.map(evento => ({
      ...evento,
      numero_empleado: evento["Usuario.numero_empleado"] || null,
      nombre: evento["Usuario.nombre"] || null,
      apellidos: evento["Usuario.apellidos"] || null,
      puesto: evento["Usuario.puesto"] || null,
      jefe_directo: evento["Usuario.jefe_directo"] || null,
      id_papeleta: evento.id,
      nombre_departamento: evento["Usuario.Departamento.nombre_departamento"] || null,
      empresa_usuario: evento["Usuario.Empresa.empresa_usuario"] || null,
      formulario: typeof evento.formulario === "string" ? JSON.parse(evento.formulario) : evento.formulario,
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}