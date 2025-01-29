import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { departamento } = req.query;

  if (departamento != null) {
    try {
      // Consulta para obtener los usuarios por departamento
      const [result] = await pool.execute('SELECT * FROM usuarios WHERE departamento_id = ?', [departamento]);
      if (result.length > 0) {
        const users = result;
        return res.status(200).json({ success: true, users });
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  } else {
    try {
      // Consulta para obtener los usuarios con departamentos específicos
      const [result] = await pool.execute('SELECT * FROM usuarios WHERE departamento_id IN (7, 11)');
      if (result.length > 0) {
        const users = result;
        return res.status(200).json({ success: true, users });
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
  }
}