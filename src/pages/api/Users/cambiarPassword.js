import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { userId, nuevaContraseña } = req.body;
  const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

  try {
    // Actualizar la contraseña en la base de datos
    const [result] = await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, userId]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}