import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  const { userId, nuevaContraseña } = req.body;
  const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

  try {
    // Guardar el formulario en la base de datos
    await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashedPassword, userId]);

    res.status(201).json({ message: 'Formulario guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}