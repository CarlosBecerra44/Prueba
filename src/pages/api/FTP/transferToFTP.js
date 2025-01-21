import { Client } from 'basic-ftp';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { blobUrl, remoteFileName } = req.body;

  if (!blobUrl || !remoteFileName) {
    return res.status(400).json({ message: 'Faltan parámetros necesarios: blobUrl o remoteFileName.' });
  }

  try {
    // Descargar el archivo desde Vercel Blob
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error('Error al descargar el archivo desde Blob');
    }
    const fileStream = response.body;

    // Subir el archivo al servidor FTP
    const client = new Client();
    await client.access({
      host: 'ftp.aionnet.net',
      user: 'aionnetx',
      password: 'Mxxnatura2536//',
      secure: false,
    });

    console.log('Conexión al servidor FTP establecida.');
    await client.ensureDir('/uploads');
    await client.uploadFrom(fileStream, remoteFileName);
    console.log(`Archivo "${remoteFileName}" subido correctamente al servidor FTP.`);

    client.close();

    res.status(200).json({ success: true, message: 'Archivo transferido al servidor FTP.' });
  } catch (error) {
    console.error('Error al transferir el archivo al servidor FTP:', error);
    res.status(500).json({ success: false, message: 'Error al transferir el archivo.' });
  }
}