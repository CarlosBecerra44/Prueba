import Producto from "@/models/Productos";
import Identificador from "@/models/Identificadores";
import IdentificadorProducto from "@/models/IdentificadoresProductos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "El ID es requerido" });
  }

  try {
    // Buscar el producto con su identificador relacionado
    const producto = await IdentificadorProducto.findOne({
      where: { producto_id: id },
      include: [
        {
          model: Identificador,
          attributes: [
            "id",
            "nombre",
            "no_articulo",
            "categoria",
            "linea",
            "formato",
            "presentacion_sugerida",
            "modo_empleo",
            "ingredientes",
            "funcion_principal",
            "funcion_especifica",
            "recomendado_para",
            "productos_complementarios",
          ],
        },
      ],
    });

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    // Estructura el resultado incluyendo datos del Identificador
    const identificador = producto.Identificador || {};

    const result = {
      ...producto.toJSON(), // convierte producto a objeto simple
      nombre: identificador.nombre || null,
      no_articulo: identificador.no_articulo || null,
      categoria: identificador.categoria || null,
      linea: identificador.linea || null,
      formato: identificador.formato || null,
      presentacion_sugerida: identificador.presentacion_sugerida || null,
      modo_empleo: identificador.modo_empleo || null,
      ingredientes: identificador.ingredientes || null,
      funcion_principal: identificador.funcion_principal || null,
      funcion_especifica: identificador.funcion_especifica || null,
      recomendado_para: identificador.recomendado_para || null,
      productos_complementarios: identificador.productos_complementarios || null,
    };

    return res.status(200).json({ success: true, producto: result });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
}