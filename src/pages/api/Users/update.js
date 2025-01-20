import bcrypt from 'bcrypt';
import pool from '@/lib/db'; // Tu conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, apellidos, correo, password } = req.body;

    try {
      // Encripta la nueva contraseña antes de actualizar
      if(password === "") {
        const query = 'UPDATE usuarios SET nombre = $1, apellidos = $2 WHERE correo = $3';
        const values = [nombre, apellidos, correo];
        await pool.query(query, values);

        return res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Realiza el update en la base de datos
        const query = 'UPDATE usuarios SET nombre = $1, apellidos = $2, password = $3 WHERE correo = $4';
        const values = [nombre, apellidos, hashedPassword, correo];
        await pool.query(query, values);

        return res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
      }
    } catch (error) { 
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}