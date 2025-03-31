import Producto from "@/models/Productos";

// Configuración del handler
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const {
      nombre,
      proveedor,
      categoriaGeneral,
      subcategoria,
      especificacion,
      medicion,
      codigo,
      costo,
      compraMinima,
      descripcion,
    } = req.body;

    // Insertar el producto en la base de datos
    const producto = await Producto.create({
      nombre,
      proveedor_id: proveedor,
      Tipo_id: categoriaGeneral,
      Categoria_id: subcategoria,
      Subcategoria_id: especificacion || null,
      medicion,
      codigo,
      costo,
      cMinima: compraMinima,
      descripcion,
    });

    res.status(201).json({ success: true, message: "Producto guardado correctamente", producto });
  } catch (error) {
    console.error("Error registrando el producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}