import pool from '@/lib/db';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar bodyParser para que formidable maneje el form-data
  },
};

export default async function guardarFormulario(req, res) {
  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: path.join(process.cwd(), '/public/uploads'), // Ruta donde se guardará el archivo
      keepExtensions: true, // Mantener la extensión del archivo
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al subir el archivo:', err);
        return res.status(500).json({ success: false, message: 'Error al procesar el archivo' });
      }

      // Verificar el contenido de 'files'
      console.log('Files:', files);

      // Verificar si el archivo PDF existe y manejar arrays de files
      const pdfFile = files.nowPdf && files.nowPdf[0]; 
      if (!pdfFile) {
        return res.status(400).json({ success: false, message: 'Archivo PDF no encontrado' });
      }

      // Usamos filepath si existe, o path si es la versión anterior de formidable
      const filePathKey = pdfFile.filepath || pdfFile.path;
      
      if (!filePathKey) {
        return res.status(400).json({ success: false, message: 'Ruta de archivo no encontrada' });
      }

      const pdfPath = `/uploads/${path.basename(filePathKey)}`;

      try {
        // Guardar los datos en la base de datos
        const result = await pool.query(
          'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado) VALUES ($1, $2, $3) RETURNING *',
          [fields, pdfPath, false] // Guardamos la ruta del PDF
        );

        // Enviar la respuesta con éxito
        res.status(200).json({ success: true, data: result.rows[0] });
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
