import fs from "fs";
import { Client } from "basic-ftp";
import path from "path";
import formidable from "formidable";
import Producto from "@/models/Productos";
import ImagenProducto from "@/models/ImagenesProductos";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: path.join(process.cwd(), "uploads"),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error procesando el formulario:", err);
      return res.status(500).json({ message: "Error al procesar el formulario" });
    }

    console.log("Archivos recibidos:", files);

    if (!files.imagenes) {
      return res.status(400).json({ message: "No se recibieron imágenes" });
    }

    const imagenes = Array.isArray(files.imagenes) ? files.imagenes : [files.imagenes];

    let client;
    try {
      const producto = await Producto.create({
        nombre: fields.nombre,
        proveedor_id: fields.proveedor,
        Tipo_id: fields.categoriaGeneral,
        Categoria_id: fields.subcategoria,
        Subcategoria_id: fields.especificacion || null,
        medicion: fields.medicion,
        codigo: fields.codigo,
        costo: fields.costo,
        cMinima: fields.compraMinima,
        descripcion: fields.descripcion,
      });

      client = new Client();
      client.ftp.verbose = true;
      await client.access({
        host: "50.6.199.166",
        user: "aionnet",
        password: "Rrio1003",
        secure: false,
      });

      const uploadedImages = [];
      for (const file of imagenes) {
        const filePath = `/uploads/imagenesProductos/${file.name}`;

        try {
          await client.uploadFrom(file.path, filePath);
          console.log(`Archivo subido con éxito: ${filePath}`);
          uploadedImages.push({ ruta: filePath, producto_id: producto.id });

          // Eliminar archivo temporal
          fs.unlinkSync(file.path);
        } catch (uploadErr) {
          console.error(`Error al subir el archivo ${file.name}:`, uploadErr);
        }
      }

      await ImagenProducto.bulkCreate(uploadedImages);

      res.status(201).json({ success: true, message: "Producto e imágenes guardadas correctamente" });
    } catch (error) {
      console.error("Error registrando el producto:", error);
      res.status(500).json({ message: "Error en el servidor" });
    } finally {
      if (client) client.close();
    }
  });
};