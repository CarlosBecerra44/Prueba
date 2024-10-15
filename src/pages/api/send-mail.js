
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { emails, subject, message } = req.body;

    // Configurar el transporte SMTP utilizando los detalles de cPanel
    const transporter = nodemailer.createTransport({
      host: 'mail.aionnet.net', // Servidor SMTP de tu dominio
      port: 465, // O 587 si estás utilizando TLS
      secure: true, // Usar true para puerto 465, false para otros puertos
      auth: {
        user: 'etiquetas@aionnet.net', // Tu correo completo
        pass: '!SD[ftw.ZOR4', // La contraseña de tu cuenta de correo
      },
    });

    // Enviar correos a cada dirección
    try {
      for (const email of emails) {
        await transporter.sendMail({
          from: 'etiquetas@aionnet.net',
          to: email,
          subject: subject,
          text: message,
        });
      }

      res.status(200).json({ message: 'Correos enviados exitosamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al enviar los correos' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
