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
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), '/uploads');
    form.keepExtensions = true;

    try {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error en el formulario:', err);
          return res.status(500).json({ success: false, message: 'Error al procesar el formulario' });
        }

        const filePath = files.pdf[0].filepath; // Cambia esto según cómo quieras manejar los archivos
        const datosFormulario = fields; // Los datos del formulario
        const id = fields.id;

        let connection;

        try {
          // Obtener una conexión del pool
          connection = await pool.getConnection();

          const query = 'UPDATE etiquetas_form SET datos_formulario = ?, ruta_pdf = ? WHERE id = ?';
          const [result] = await connection.query(query, [JSON.stringify(datosFormulario), filePath, id]);

          if (result.affectedRows > 0) {
            // Enviar la respuesta con éxito
            res.status(200).json({ success: true, message: 'Formulario guardado correctamente' });
          } else {
            res.status(404).json({ success: false, message: 'Formulario no encontrado' });
          }
        } catch (error) {
          console.error('Error al guardar en la base de datos:', error);
          return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
        } finally {
          // Liberar la conexión
          if (connection) {
            connection.release();
          }
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