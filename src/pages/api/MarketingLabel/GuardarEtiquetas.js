import pool from '@/lib/db';
import formidable from 'formidable';
import fs from 'fs';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar bodyParser para usar formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const form = formidable({
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024, // Límite de tamaño de archivo (50MB)
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error al procesar el formulario:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al procesar el formulario',
      });
    }

    const pdfFile = files.nowPdf;
    if (!pdfFile) {
      return res.status(400).json({
        success: false,
        message: 'Archivo PDF no encontrado.',
      });
    }

    const filePath = pdfFile.filepath || pdfFile.path;
    const fileName = pdfFile.originalFilename || pdfFile.name;

    try {
      // Subir el archivo a Vercel Blob
      const fileStream = fs.createReadStream(filePath);
      const { url: blobUrl } = await put(fileName, fileStream, {
        access: 'public',
      });

      console.log(`Archivo subido a Vercel Blob: ${blobUrl}`);

      // Guardar información en la base de datos
      const rutaPdf = blobUrl; // URL del archivo en Vercel Blob
      const result = await pool.query(
        'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado, estatus) VALUES ($1, $2, $3, $4) RETURNING *',
        [fields, rutaPdf, false, 'Pendiente']
      );

      console.log('Resultado de la base de datos:', result.rows);

      res.status(200).json({
        success: true,
        message: `Archivo subido correctamente a Vercel Blob.`,
        blobUrl,
      });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({
        success: false,
        message: `Error al procesar la solicitud: ${error.message}`,
      });
    }
  });
}