import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { Client } from 'basic-ftp';

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser to handle file uploads with formidable
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new Client();
    client.ftp.verbose = true; // Opcional: para ver más logs

    const uploadDir = path.join(process.cwd(), '/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const form = new IncomingForm({
      uploadDir: uploadDir, // Guardar temporalmente los archivos aquí
      keepExtensions: true, // Mantener las extensiones de los archivos subidos
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al procesar el formulario:', err);
        return res.status(500).json({ error: 'Error al procesar el formulario' });
      }

      try {
        const fileArray = Array.isArray(files.file) ? files.file : [files.file]; // Cambié 'files.file' para coincidir con 'file' desde el frontend

        await client.access({
          host: "192.168.1.87",
          user: "pruebas@nutriton.com.mx",
          password: "NutriAdmin2035",
          secure: false,
        });

        for (const file of fileArray) {
          const filePath = file.filepath; // La propiedad correcta en formidable es 'filepath'

          if (!filePath) {
            return res.status(400).json({ error: 'Ruta del archivo no disponible' });
          }

          if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Archivo no encontrado' });
          }

          const remoteFilePath = path.join('/', file.originalFilename);
          await client.uploadFrom(filePath, remoteFilePath);
        }

        res.status(200).json({ message: "Archivo(s) subido(s) exitosamente" });
      } catch (err) {
        console.error("Error subiendo archivo(s):", err);
        res.status(500).json({ error: "Error al subir archivo(s)" });
      } finally {
        client.close();
      }
    });
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
