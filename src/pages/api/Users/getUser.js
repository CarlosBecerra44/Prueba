import pool from '@/lib/db'; // Asegúrate de que pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo } = req.body;

    try {
      // Consulta para verificar si el usuario existe en la base de datos
      const query = 'SELECT * FROM usuarios WHERE correo = ?';
      const [userResult] = await pool.execute(query, [correo]);

      if (userResult.length > 0) {
        const user = userResult[0];  // El usuario encontrado
        const idUser = user.departamento_id;  // Obtener el ID del departamento del usuario
        
        // Consulta para obtener el departamento basado en el departamento_id
        const query2 = 'SELECT * FROM departamentos WHERE id = ?';
        const [departmentResult] = await pool.execute(query2, [idUser]);

        if(departmentResult.length > 0) {
          const departamento = departmentResult[0];  // El departamento correspondiente
          // Devuelve tanto el usuario como el departamento
          return res.status(200).json({ success: true, user, departamento });
        } else {
          return res.status(404).json({ success: false, message: 'Departamento no encontrado' });
        }
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } else {
    // Responde si el método no es POST
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}