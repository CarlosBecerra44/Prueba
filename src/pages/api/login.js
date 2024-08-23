import bcrypt from 'bcrypt';
import pool from '@/lib/db'; // Tu conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
    }

    try {
      // Consulta a la base de datos para obtener el usuario
      const query = 'SELECT * FROM usuarios WHERE correo = $1';
      const values = [correo];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        const user = result.rows[0];

        // Verifica que la contraseña encriptada exista
        if (!user.password) {
          return res.status(500).json({ success: false, message: 'Error: Contraseña encriptada no encontrada en la base de datos' });
        }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
          return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', user });
        } else {
          return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}