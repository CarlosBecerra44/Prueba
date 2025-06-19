import fs from "fs";
import { Client } from "basic-ftp";
import formidable from "formidable";
import path from "path";

// Desactiva el body parser de Next.js para usar formidable
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
    multiples: false, // Solo un archivo
    uploadDir: "/tmp",
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al procesar el formulario:", err);
      return res.status(500).json({ message: "Error al procesar el formulario" });
    }

    const file = files.comprobante;

    if (!file) {
      return res.status(400).json({ message: "No se recibió ningún archivo" });
    }

    try {
      // Crear nuevo nombre de archivo con la fecha
      const now = new Date();
      const formattedDate = now.toISOString().replace(/[-:T]/g, "").split(".")[0];
      const newFileName = `${formattedDate}_${file.name}`;

      // Conectar al servidor FTP
      const client = new Client();
      client.ftp.verbose = true;

      await client.access({
        host: "50.6.199.166",
        user: "aionnet",
        password: "Rrio1003",
        secure: false,
      });

      const remotePath = `/uploads/papeletas/${newFileName}`;

      // Subir el archivo directamente
      await client.uploadFrom(file.path, remotePath);

      // Cerrar la conexión FTP
      client.close();

      // Borrar el archivo temporal
      try {
        fs.unlinkSync(file.path);
      } catch (unlinkErr) {
        console.error("Error al eliminar archivo temporal:", unlinkErr);
      }

      res.status(200).json({ message: "Archivo subido correctamente al FTP", fileName: newFileName });
    } catch (error) {
      console.error("Error al subir al FTP:", error);
      res.status(500).json({ error: "No se pudo subir el archivo al FTP" });
    }
  });
}