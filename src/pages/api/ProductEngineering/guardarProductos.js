import fs from "fs";
import { Client } from "basic-ftp";
import path from "path";
import Producto from "@/models/Productos";
import ImagenProducto from "@/models/ImagenesProductos";

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
      imagenes, // Ahora recibimos un array de imágenes en Base64
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

    // Conectar al servidor FTP
    const client = new Client();
    client.ftp.verbose = true;
    await client.access({
      host: "50.6.199.166",
      user: "aionnet",
      password: "Rrio1003",
      secure: false,
    });

    const uploadedImages = [];

    // Subir cada imagen en Base64 al servidor FTP
    for (let i = 0; i < imagenes.length; i++) {
      const base64Data = imagenes[i].replace(/^data:image\/\w+;base64,/, ""); // Limpiar el encabezado Base64
      const buffer = Buffer.from(base64Data, "base64"); // Convertir a Buffer
      const fileName = `producto_${producto.id}_${i + 1}.jpg`; // Nombre único para cada imagen
      const tempFilePath = path.join(process.cwd(), "uploads", fileName); // Ruta temporal

      // Guardar temporalmente la imagen
      fs.writeFileSync(tempFilePath, buffer);

      // Ruta donde se subirá el archivo en el servidor FTP
      const filePath = `/uploads/imagenesProductos/${fileName}`;

      try {
        // Subir el archivo al FTP
        await client.uploadFrom(tempFilePath, filePath);
        console.log(`Archivo subido con éxito a: ${filePath}`);
      } catch (uploadErr) {
        console.error(`Error subiendo el archivo ${fileName}:`, uploadErr);
        return res.status(500).json({ message: "Error al subir la imagen al FTP" });
      }

      // Guardar la ruta en la base de datos
      uploadedImages.push({ ruta: filePath, producto_id: producto.id });

      // Eliminar el archivo temporal después de subirlo
      fs.unlinkSync(tempFilePath);
    }

    // Cerrar la conexión FTP
    client.close();

    // Guardar las rutas en la base de datos
    await ImagenProducto.bulkCreate(uploadedImages);

    res.status(201).json({ success: true, message: "Producto e imágenes guardadas correctamente" });
  } catch (error) {
    console.error("Error registrando el producto:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}