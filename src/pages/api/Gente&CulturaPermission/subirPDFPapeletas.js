import { Client } from "basic-ftp";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { fileName, fileContent } = req.body; // `fileContent` debe ser una cadena Base64

      const client = new Client();
      client.ftp.verbose = true;

      // Configurar acceso FTP
      await client.access({
        host: "50.6.199.166",  // Dirección del servidor FTP
        user: "aionnet",         // Usuario FTP
        password: "$ZkSex&+PSbQ", // Contraseña FTP
        secure: false,
      });

      // Convertir el contenido Base64 a un Buffer
      const buffer = Buffer.from(fileContent, "base64");

      // Crear un stream desde el buffer
      const { Readable } = require("stream");
      const bufferStream = new Readable();
      bufferStream.push(buffer);
      bufferStream.push(null); // Indicar fin del stream

      // Subir el archivo al FTP directamente desde el stream
      await client.uploadFrom(bufferStream, `/uploads/papeletas/${fileName}`);

      client.close();
      res.status(200).json({ message: "Archivo subido correctamente al FTP" });
    } catch (error) {
      console.error("Error al subir al FTP:", error);
      res.status(500).json({ error: "No se pudo subir el archivo al FTP" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}