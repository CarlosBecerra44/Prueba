import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id: userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'El id del usuario es necesario' });
  }

  let connection;

  try {
    connection = await pool.getConnection();

    if (req.method === 'GET') {
      try {
        const existingPermisoQuery = `
          SELECT id, seccion, campo FROM permiso
          WHERE id = (
            SELECT id_permiso FROM usuarios WHERE id = ?
          )
        `;
        const [existingPermisoResult] = await connection.execute(existingPermisoQuery, [userId]);

        if (existingPermisoResult.length > 0) {
          let permiso = existingPermisoResult[0];

          permiso.seccion = permiso.seccion ? JSON.parse(permiso.seccion) : [];
          permiso.campo = permiso.campo ? JSON.parse(permiso.campo) : {};

          return res.status(200).json({ message: 'Permisos encontrados', permiso });
        } else {
          return res.status(404).json({ message: 'No se encontraron permisos para este usuario' });
        }
      } catch (error) {
        console.error('Error al obtener los permisos', error);
        return res.status(500).json({ message: 'Error al obtener los permisos' });
      }
    } else if (req.method === 'POST') {
      const { selections } = req.body;
      if (!Array.isArray(selections) || selections.length === 0) {
        return res.status(400).json({ message: 'Las selecciones son requeridas' });
      }

      try {
        const combinedSelections = selections.reduce((acc, selection) => {
          const { seccion, campo } = selection;
          acc[seccion] = acc[seccion] ? [...new Set([...acc[seccion], campo])] : [campo];
          return acc;
        }, {});

        const seccionJson = JSON.stringify(Object.keys(combinedSelections));
        const campoJson = JSON.stringify(combinedSelections);

        const existingPermisoQuery = `
          SELECT id, seccion, campo FROM permiso
          WHERE id = (
            SELECT id_permiso FROM usuarios WHERE id = ?
          )
        `;
        const [existingPermisoResult] = await connection.execute(existingPermisoQuery, [userId]);

        let permisoId = null;

        if (existingPermisoResult.length > 0) {
          let permiso = existingPermisoResult[0];
          permisoId = permiso.id;

          let seccionExistente = permiso.seccion ? JSON.parse(permiso.seccion) : [];
          let campoExistente = permiso.campo ? JSON.parse(permiso.campo) : {};

          const nuevaSeccion = [...new Set([...seccionExistente, ...Object.keys(combinedSelections)])];
          const nuevoCampo = { ...campoExistente, ...combinedSelections };

          const updateQuery = `
            UPDATE permiso 
            SET seccion = ?, campo = ?
            WHERE id = ?
          `;
          await connection.execute(updateQuery, [JSON.stringify(nuevaSeccion), JSON.stringify(nuevoCampo), permisoId]);
        } else {
          const insertQuery = `
            INSERT INTO permiso (seccion, campo)
            VALUES (?, ?)
          `;
          const [insertResult] = await connection.execute(insertQuery, [seccionJson, campoJson]);
          permisoId = insertResult.insertId;

          const updateUserQuery = `
            UPDATE usuarios
            SET id_permiso = ?
            WHERE id = ?
          `;
          await connection.execute(updateUserQuery, [permisoId, userId]);
        }

        return res.status(200).json({ message: 'Permisos actualizados correctamente' });
      } catch (error) {
        console.error('Error al guardar permisos', error);
        return res.status(500).json({ message: 'Error al guardar permisos' });
      }
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error en la conexión:', error);
    return res.status(500).json({ message: 'Error en la conexión' });
  } finally {
    if (connection) connection.release();
  }
}