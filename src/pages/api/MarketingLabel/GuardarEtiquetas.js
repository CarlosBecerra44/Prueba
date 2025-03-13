import formidable from 'formidable';
import FormulariosEtiquetas from '@/models/FormulariosEtiquetas';

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

    try {
      // Usando Sequelize para guardar los datos en la base de datos
      const formularioGuardado = await FormulariosEtiquetas.create({
        datos_formulario: JSON.stringify(fields), // Los datos del formulario
        pdf_path: fileUrl,         // Ruta del archivo PDF
        eliminado: false,          // Establecer el estado de 'eliminado' como false
        estatus: 'Pendiente',      // Establecer el estatus como 'Pendiente'
      });

      console.log('Formulario guardado:', formularioGuardado);

      res.status(200).json({
        success: true,
        message: 'Formulario guardado correctamente.',
        formularioGuardado: formularioGuardado, // Retornar la fila guardada
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