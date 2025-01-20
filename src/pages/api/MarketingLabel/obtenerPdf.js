import { Client } from 'basic-ftp';

export default async function handler(req, res) {
  const { pdf } = req.query; // Nombre del archivo PDF

  if (!pdf) {
    return res.status(400).json({ message: 'El nombre del archivo PDF es necesario' });
  }

  const client = new Client();
  try {
    await client.access({
      host: "ftp.aionnet.net",  // Dirección del servidor FTP
      user: "aionnetx",         // Usuario FTP
      password: "Mxxnatura2536//", // Contraseña FTP
      secure: false
    });

    /*await client.access({
      host: "192.168.1.87", // Dirección del servidor FTP
      user: "pruebas",        // Usuario FTP
      password: "NutriAdmin2035",  // Contraseña FTP
      secure: false            // Usa 'true' si el servidor FTP requiere conexión segura
    });*/

    // Usamos un WritableStream para enviar el archivo directamente al cliente
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pdf}"`);

    // Usar downloadTo para escribir el archivo en la respuesta directamente
    await client.downloadTo(res, `${pdf}`);

  } catch (err) {
    console.error('Error al acceder al archivo desde el servidor FTP:', err);
    return res.status(500).json({ message: 'Error al acceder al archivo PDF' });
  } finally {
    client.close();
  }
}