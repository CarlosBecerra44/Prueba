// pages/api/register.js
import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, email, password, confirmPassword,rol='estandar' } = req.body;

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el nuevo usuario en la base de datos
    const newUser = await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword,rol]
    );

    res.status(201).json({ success: true, user: newUser.rows[0] });
  } catch (error) {
    console.error('Error registrando al usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}
