import pool from '@/lib/db';
export default async function handler(req, res) {
    if (req.method === 'GET') {
      const { userId: userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'El id del usuario es necesario' });
      }
  
      try {
        // Consulta para obtener el `id_permiso` desde `usuarios` y luego obtener `seccion` y `campo` desde `permiso`
      const userPermissionQuery = `
      SELECT permiso.seccion, permiso.campo
      FROM usuarios
      INNER JOIN permiso ON usuarios.id_permiso = permiso.id
      WHERE usuarios.id = $1
    `;

    const result = await pool.query(userPermissionQuery, [userId]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'No se encontraron permisos para este usuario' });
        }
  
        // Devolver solo el primer registro encontrado, o ajusta según tus necesidades
        res.status(200).json(result.rows[0]);
        console.log(result.rows[0]);
      } catch (error) {
        console.error('Error al obtener permisos', error);
        res.status(500).json({ message: 'Error al obtener permisos' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ message: `Método ${req.method} no permitido` });
    }
  }
  