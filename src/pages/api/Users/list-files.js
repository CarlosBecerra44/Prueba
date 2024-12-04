import pool from '@/lib/db';

const ftp = require("basic-ftp");

export default async function handler(req, res) {
  try {
    const { folderId, correo } = req.query;
console.log(correo)
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    if (result.rows.length > 0) {
      const id = result.rows[0].departamento_id; // Accediendo a la columna 'id' de la primera fila
      const result2 = await pool.query('SELECT * FROM departamentos WHERE id = $1', [id]);

      if(result2.rows.length > 0) {
        const client = new ftp.Client();
        client.ftp.verbose = true;
    
        // Accede al servidor FTP
        await client.access({
          host: "192.168.1.87",
          user: "pruebas@nutriton.com.mx",
          password: "NutriAdmin2035",
          secure: false, // Cambia a true si el servidor FTP es seguro (FTPS)
        });
    
        // Define la ruta que quieres listar (usa "/" si no se especifica una carpeta)
        const directory = folderId ? `/${folderId}` : "/";
    
        // Lista los archivos en la carpeta especificada
        const fileList = await client.list(directory);
    
        // Cierra la conexión FTP
        await client.close();
    
        // Devuelve la lista de archivos al frontend
        res.status(200).json({ files: fileList });
      } else {
        console.log("No se encontró el departamento solicitado");
      }
    } else {
      console.log("No se encontró el usuario con el correo proporcionado.");
    }
  } catch (error) {
    console.error("Error conectando al FTP:", error);
    res.status(500).json({ error: "Error conectando al FTP" });
  }
}
