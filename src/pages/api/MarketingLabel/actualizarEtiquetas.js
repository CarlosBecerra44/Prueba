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
    try {
      // Usamos formidable para manejar los archivos subidos
      const form = new formidable.IncomingForm();
      form.uploadDir = path.join(process.cwd(), '/uploads');
      form.keepExtensions = true;

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error en el formulario:', err);
          return res.status(500).json({ success: false, message: 'Error al procesar el formulario' });
        }

        // Aquí puedes agregar el código para guardar la ruta del archivo o los datos del formulario en la base de datos
        const filePath = files.pdf[0].filepath; // Cambia esto según cómo quieras manejar los archivos
        const datosFormulario = fields; // Los datos del formulario

        try {
          const query = 'UPDATE etiquetas_form SET datos_formulario = ?, ruta_pdf = ? WHERE id = ?';
          const result = await pool.query(query, [JSON.stringify(datosFormulario), filePath, fields.id]);

          if (result.affectedRows > 0) {
            // Enviar la respuesta con éxito
            res.status(200).json({ success: true, message: 'Formulario guardado correctamente' });
          } else {
            return res.status(404).json({ success: false, message: 'Formulario no encontrado' });
          }
        } catch (error) {
          console.error('Error al guardar en la base de datos:', error);
          return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
        }
      });
    } catch (error) {
      console.error('Error en el proceso de guardado:', error);
      return res.status(500).json({ success: false, message: 'Error en el proceso de guardado' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}