import pool from '@/lib/db'; // Asegúrate de que db esté configurado correctamente
import formidable from 'formidable';

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

    // Si la URL ya fue enviada desde el frontend, solo procesamos la base de datos
    const fileUrl = fields.fileUrl; // URL del archivo PDF que se pasa desde el frontend
    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'URL del archivo PDF no proporcionada.',
      });
    }

    let connection;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();

      // Guardar la información en la base de datos
      const [rows] = await connection.query(
        'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado, estatus) VALUES (?, ?, ?, ?)',
        [JSON.stringify(fields), fileUrl, false, 'Pendiente'] // Guardar los datos como JSON en la base de datos
      );

      console.log('Resultado de la base de datos:', rows);

      res.status(200).json({
        success: true,
        message: 'Formulario guardado correctamente.',
        formularioGuardado: rows[0], // Retornar la fila guardada en la base de datos
      });
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).json({
        success: false,
        message: `Error al procesar la solicitud: ${error.message}`,
      });
    } finally {
      // Liberar la conexión
      if (connection) {
        connection.release();
      }
    }
  });
}