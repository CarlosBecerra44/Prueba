import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ success: false, message: 'correo y contraseña son requeridos' });
    }

    try {
      console.log('Conectando a la base de datos...');
      const query = 'SELECT * FROM usuarios WHERE correo = $1';
      const values = [correo];
      console.log('Ejecutando consulta:', query, values);
      
      const result = await pool.query(query, values);
      console.log('Resultado de la consulta:', result);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log('Usuario encontrado:', user);

        // Comparar el campo 'contraseña' de la base de datos
        if (user.contraseña === password) {
          console.log('Contraseña correcta');
          return res.status(200).json({ success: true, message: 'Inicio de sesión exitoso', user });
        } else {
          console.log('Contraseña incorrecta');
          return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
      } else {
        console.log('Usuario no encontrado');
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