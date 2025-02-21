import bcrypt from 'bcrypt';
import pool from '@/lib/db'; // Tu conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { nombre, apellidos, correo, password } = req.body;
    let connection;

    try {
      // Obtener la conexión del pool
      connection = await pool.getConnection();

      // Si la contraseña no es proporcionada, solo actualiza los datos básicos
      if (password === "") {
        const query = 'UPDATE usuarios SET nombre = ?, apellidos = ? WHERE correo = ?';
        const values = [nombre, apellidos, correo];
        await connection.execute(query, values);

        return res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
      } else {
        // Encriptar la nueva contraseña antes de actualizar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Realiza el update en la base de datos incluyendo la contraseña
        const query = 'UPDATE usuarios SET nombre = ?, apellidos = ?, password = ? WHERE correo = ?';
        const values = [nombre, apellidos, hashedPassword, correo];
        await connection.execute(query, values);

        return res.status(200).json({ success: true, message: 'Usuario actualizado correctamente' });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}