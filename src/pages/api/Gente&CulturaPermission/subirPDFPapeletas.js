import formidable from 'formidable';
import { Client } from 'basic-ftp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,  // Asegúrate de deshabilitar el body parser de Next.js
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Inicializar formidable para manejar el formulario
    const form = new formidable.IncomingForm();

    // Configurar la carpeta de carga temporal
    form.uploadDir = "/";  // O donde quieras guardar los archivos temporalmente
    form.keepExtensions = true;  // Mantener las extensiones de archivo
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al procesar el archivo:', err);
        return res.status(500).json({ error: 'Error al procesar el archivo' });
      }

      console.log('Campos recibidos:', fields);
      console.log('Archivos recibidos:', files);  // Verifica los archivos que llegan

      const file = files.comprobante ? files.comprobante[0] : null;
      if (!file) {
        console.error('No se ha recibido un archivo válido');
        return res.status(400).json({ error: 'No se ha recibido un archivo válido' });
      }

      // Procesar el archivo y subirlo al servidor FTP
      const fileStream = fs.createReadStream(file.filepath);
      const client = new Client();
      try {
        await client.access({
          host: 'ftp.aionnet.net',
          user: 'aionnetx',
          password: 'Mxxnatura2536//',
          secure: false,
        });

        await client.ensureDir('/uploads');
        await client.uploadFrom(fileStream, file.originalFilename);

        console.log('Archivo subido correctamente al servidor FTP');
        res.status(200).json({ message: 'Archivo subido correctamente al servidor FTP' });
      } catch (err) {
        console.error('Error al subir el archivo al servidor FTP:', err);
        res.status(500).json({ error: 'Error al subir el archivo al servidor FTP' });
      } finally {
        client.close();
      }
    });
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}