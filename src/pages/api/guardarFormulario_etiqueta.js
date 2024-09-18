import { Client } from 'pg';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path'; // Importa path para manejar rutas

// Configura la conexión a la base de datos PostgreSQL
const client = new Client({
  user: 'aionet_owner',
  host: 'ep-bitter-scene-a5wk1xt2.us-east-2.aws.neon.tech',
  database: 'aionet',
  password: 'rzUZtRVd2WD9',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Esto asegura que la conexión use SSL, pero sin verificar el certificado
  },// Puerto por defecto de PostgreSQL
});

client.connect();

export const config = {
  api: {
    bodyParser: false, // Importante para manejar archivos
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Error al procesar el formulario" });
        return;
      }

      console.log("Archivos recibidos:", files);

      const { beforePdfPreview, nowPdfPreview } = files;

      // Verificar si los archivos existen
      if (!beforePdfPreview || !nowPdfPreview) {
        res.status(400).json({ error: "Los archivos PDF son obligatorios." });
        return;
      }

      // Procesar y mover archivos, asegurando las rutas correctas
      const uploadDir = path.join(process.cwd(), 'public/uploads'); // Ruta de carga

      // Crear el directorio si no existe
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Manejo de archivo versión 0
      const oldPathBefore = beforePdfPreview.filepath;  // Ruta temporal del archivo
      const newPathBefore = path.join(uploadDir, beforePdfPreview.originalFilename); // Ruta de destino
      fs.renameSync(oldPathBefore, newPathBefore);  // Mueve el archivo

      // Manejo de archivo versión 1
      const oldPathNow = nowPdfPreview.filepath;  // Ruta temporal del archivo
      const newPathNow = path.join(uploadDir, nowPdfPreview.originalFilename); // Ruta de destino
      fs.renameSync(oldPathNow, newPathNow);  // Mueve el archivo

      // Guardar en PostgreSQL
      const query = `
        INSERT INTO etiquetas (nombre_producto, proveedor, pdf_version_0, pdf_version_1)
        VALUES ($1, $2, $3, $4) RETURNING id;
      `;

      const values = [
        fields.nombre_producto,
        fields.proveedor,
        newPathBefore, // Ruta del archivo versión 0
        newPathNow, // Ruta del archivo versión 1
      ];

      try {
        console.log('Guardando en la base de datos...');
        const result = await client.query(query, values);
        res.status(200).json({ id: result.rows[0].id });
      } catch (err) {
        console.error("error a guardar datos ",err);
        res.status(500).json({ error: 'Error al guardar en la base de datos' });
      }
    });
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
