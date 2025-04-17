import IdentificadorProducto from "@/models/IdentificadoresProductos";
import Producto from "@/models/Productos";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { idProductoValidar, productoAValidar, imagenSeleccionada, idUser } = req.body;

  console.log(productoAValidar)

  if (!idProductoValidar || !productoAValidar) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  try {
    for (const identificador of productoAValidar.identificadoresProductos) {
      const [registro, creado] = await IdentificadorProducto.findOrCreate({
        where: {
          producto_id: idProductoValidar,
          identificador_id: identificador.identificador_id,
        },
        defaults: {
          tolerado: identificador.tolerancia || null,
        },
      });

      if (!creado) {
        // Ya existía, hacemos update
        await registro.update({
          tolerado: identificador.tolerancia || null,
        });
      }
    }

    const productoAActualizar = await Producto.findByPk(idProductoValidar);
    await productoAActualizar.update({ 
      composicion: productoAValidar.composicion, 
      modo_empleo: productoAValidar.modo_empleo, 
      condiciones: productoAValidar.condiciones,
      consideracion: productoAValidar.consideracion,
      distribucion: productoAValidar.distribucion,
      tolerancias_por: idUser
    });

    res.status(200).json({ success: true, message: "Ficha tecnica generada correctamente" });
  } catch (error) {
    console.error("Error al validar el producto:", error);
    res.status(500).json({ error: "Error al validar el producto" });
  }
}