import pool from '@/lib/db'; // Asegúrate de que pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query; // Obtiene el id del usuario de los query params
    
    if (!userId) {
      return res.status(400).json({ message: 'El id del usuario es necesario' });
    }

    let connection;
    try {
      // Obtener una conexión del pool
      connection = await pool.getConnection();
      
      // Consulta para obtener el `seccion` y `campo` desde `permiso` para el usuario
      const userPermissionQuery = `
        SELECT permiso.seccion, permiso.campo
        FROM usuarios
        INNER JOIN permiso ON usuarios.id_permiso = permiso.id
        WHERE usuarios.id = ?
      `;

      const [result] = await connection.query(userPermissionQuery, [userId]);

      if (result.length === 0) {
        return res.status(404).json({ message: 'No se encontraron permisos para este usuario' });
      }

      // Devuelve los permisos del usuario
      res.status(200).json(result[0]);
      console.log(result[0]);
    } catch (error) {
      console.error('Error al obtener permisos', error);
      res.status(500).json({ message: 'Error al obtener permisos' });
    } finally {
      // Liberar la conexión
      if (connection) {
        connection.release();
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} no permitido` });
  }
}