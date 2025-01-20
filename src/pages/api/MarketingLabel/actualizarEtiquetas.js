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
        // Guardar los datos en la base de datos
        const result = await pool.query(
          'UPDATE etiquetas_form SET datos_formulario VALUES ($1) RETURNING *',
          [fields] // Guardamos la ruta del PDF
        );
          console.log(result.rows);
        // Enviar la respuesta con éxito
        res.status(200).json( result.rows );
      } catch (error) {
        console.error('Error al guardar en la base de datos:', error);
        return res.status(500).json({ success: false, message: 'Error al guardar en la base de datos' });
      }
    } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}