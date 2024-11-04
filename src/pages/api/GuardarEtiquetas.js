import pool from '@/lib/db';
import formidable from 'formidable';
import { Client } from 'basic-ftp';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar bodyParser para que formidable maneje el form-data
  },
};

// Función para subir el archivo directamente al servidor FTP
async function subirArchivoFtp(fileStream, remoteFileName) {
  const client = new Client();
  try {
    await client.access({
      host: "ftp.aionnet.net", // Dirección del servidor FTP
      user: "aionnetx",        // Usuario FTP
      password: "Mxxnatura2536//",  // Contraseña FTP
      secure: false            // Usa 'true' si el servidor FTP requiere conexión segura
    });

    /*await client.access({
      host: "192.168.1.87", // Dirección del servidor FTP
      user: "pruebas",        // Usuario FTP
      password: "NutriAdmin2035",  // Contraseña FTP
      secure: false            // Usa 'true' si el servidor FTP requiere conexión segura
    });*/

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
      keepExtensions: true, // Mantener la extensión del archivo
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al procesar el archivo:', err);
        return res.status(500).json({ success: false, message: 'Error al procesar el archivo' });
      }

      // Verificar el contenido de 'files'
      console.log('Files:', files);

      const pdfFile = files.nowPdf && files.nowPdf[0];
      if (!pdfFile) {
        return res.status(400).json({ success: false, message: 'Archivo PDF no encontrado' });
      }

      const fileStream = fs.createReadStream(pdfFile.filepath || pdfFile.path);
      const remoteFileName = pdfFile.originalFilename || pdfFile.name;

      try {
        // Subir el archivo directamente al servidor FTP
        await subirArchivoFtp(fileStream, remoteFileName);

        // Ruta final en el servidor FTP
        const ftpPath = `/uploads/${remoteFileName}`;

        // Guardar los datos en la base de datos
        const result = await pool.query(
          'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado, estatus) VALUES ($1, $2, $3, $4) RETURNING *',
          [fields, ftpPath, false, 'Pendiente']
        );

        console.log(result.rows);
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error al guardar en la base de datos o al subir el archivo al FTP:', error);
        return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos o al subir el archivo' });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
