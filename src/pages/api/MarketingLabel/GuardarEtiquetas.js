import pool from '@/lib/db';
import formidable from 'formidable';
import { Client } from 'basic-ftp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar bodyParser para usar formidable
  },
};

// Función para subir el archivo directamente al servidor FTP
async function subirArchivoFtp(fileStream, remoteFileName) {
  const client = new Client();
  try {
    await client.access({
      host: "ftp.aionnet.net", // Dirección del servidor FTP
      user: "aionnetx",        // Usuario FTP
      password: "Mxxnatura2536//", // Contraseña FTP
      secure: false,           // Usa 'true' si el servidor FTP requiere conexión segura
    });

    // Cambia al directorio deseado
    await client.ensureDir("/uploads");

    // Sube el archivo usando el stream directamente
    await client.uploadFrom(fileStream, remoteFileName);

    console.log('Archivo subido correctamente al servidor FTP');
  } catch (err) {
    console.error('Error al subir el archivo al servidor FTP:', err);
    throw err;
  } finally {
    client.close();
  }
}

export default async function guardarFormulario(req, res) {
  if (req.method === 'POST') {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // Permitir hasta 10 MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        if (err.message.includes('maxFileSize')) {
          return res.status(413).json({ success: false, message: 'El archivo es demasiado grande. Máximo permitido: 50 MB' });
        }
        console.error('Error al procesar el archivo:', err);
        return res.status(500).json({ success: false, message: 'Error al procesar el archivo' });
      }

      console.log('Fields:', fields);
      console.log('Files:', files);

      const pdfFile = files.nowPdf;
      if (!pdfFile) {
        return res.status(400).json({ success: false, message: 'Archivo PDF no encontrado' });
      }

      const filePath = pdfFile.filepath || pdfFile.path;
      const remoteFileName = pdfFile.originalFilename || pdfFile.name;

      console.log('PDF File Path:', filePath);

      try {
        // Leer el archivo directamente desde su ubicación temporal
        const fileStream = fs.createReadStream(filePath);

        // Subir al FTP
        await subirArchivoFtp(fileStream, remoteFileName);

        const ftpPath = `/uploads/${remoteFileName}`;
        const result = await pool.query(
          'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado, estatus) VALUES ($1, $2, $3, $4) RETURNING *',
          [fields, ftpPath, false, 'Pendiente']
        );

        console.log('Resultado de la base de datos:', result.rows);
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}