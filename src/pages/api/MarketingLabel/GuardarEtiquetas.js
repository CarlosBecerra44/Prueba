import pool from '@/lib/db';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Deshabilitar bodyParser para usar formidable
  },
};

export default async function guardarFormulario(req, res) {
  if (req.method === 'POST') {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 50 * 1024 * 1024, // Permitir hasta 50 MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error al procesar el archivo:', err);
        return res.status(500).json({ success: false, message: 'Error al procesar el archivo.' });
      }

      //console.log('Fields:', fields);
      //console.log('Files:', files);

      const pdfFile = files.nowPdf;
      if (!pdfFile) {
        return res.status(400).json({ success: false, message: 'Archivo PDF no encontrado.' });
      }

      const pdfNombre = pdfFile.originalFilename || pdfFile.name; // Nombre del archivo PDF
      const rutaPdf = `/uploads/${pdfNombre}`

      try {
        // Insertar en la base de datos
        const result = await pool.query(
          'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado, estatus) VALUES ($1, $2, $3, $4) RETURNING *',
          [fields, rutaPdf, false, 'Pendiente']
        );

        console.log('Resultado de la base de datos:', result.rows);
        res.status(200).json({ success: true, data: result.rows });
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor.' });
      }
    });
  } else {
    res.status(405).json({ success: false, message: 'Método no permitido.' });
  }
}
