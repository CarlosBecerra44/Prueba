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

          try {
            permiso.seccion = JSON.parse(permiso.seccion);
          } catch (e) {
            permiso.seccion = permiso.seccion ? permiso.seccion.split(',') : [];
          }

          try {
            permiso.campo = JSON.parse(permiso.campo);
          } catch (e) {
            permiso.campo = permiso.campo ? {} : {};
          }

          return res.status(200).json({
            message: 'Permisos existentes encontrados',
            permiso,
          });
        } else {
          return res.status(404).json({ message: 'No se encontraron permisos para este usuario' });
        }
      } catch (error) {
        console.error('Error al obtener los datos', error);
        return res.status(500).json({ message: 'Error al obtener los datos' });
      }
    } else if (req.method === 'POST') {
      const { selections } = req.body;

      try {
        const combinedSelections = selections.reduce((acc, selection) => {
          const seccion = selection.seccion;
          const campo = selection.campo;

          if (acc[seccion]) {
            acc[seccion].push(campo);
          } else {
            acc[seccion] = [campo];
          }
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

        if (existingPermisoResult.length > 0) {
          let permiso = existingPermisoResult[0];
          let seccionExistente, campoExistente;

          try {
            seccionExistente = JSON.parse(permiso.seccion);
          } catch (e) {
            seccionExistente = permiso.seccion ? permiso.seccion.split(',') : [];
          }

          try {
            campoExistente = JSON.parse(permiso.campo);
          } catch (e) {
            campoExistente = permiso.campo ? {} : {};
          }

          const nuevaSeccion = [...new Set([...seccionExistente, ...Object.keys(combinedSelections)])];
          const nuevoCampo = { ...campoExistente };

          for (const seccion in combinedSelections) {
            nuevoCampo[seccion] = nuevoCampo[seccion]
              ? [...new Set([...nuevoCampo[seccion], ...combinedSelections[seccion]])]
              : combinedSelections[seccion];
          }

          const permisoQuery = `
            UPDATE permiso 
            SET seccion = ?, campo = ?
            WHERE id = (
              SELECT id_permiso FROM usuarios WHERE id = ?
            )
          `;

          await connection.execute(permisoQuery, [JSON.stringify(nuevaSeccion), JSON.stringify(nuevoCampo), userId]);

          return res.status(200).json({ message: 'Permisos del usuario actualizados correctamente' });
        } else {
          const permisoQuery = `INSERT INTO permiso (seccion, campo) VALUES (?, ?)`;
          const [permisoResult] = await connection.execute(permisoQuery, [seccionJson, campoJson]);
          const permisoId = permisoResult.insertId;

          const userQuery = `UPDATE usuarios SET id_permiso = ? WHERE id = ?`;
          await connection.execute(userQuery, [permisoId, userId]);

          return res.status(200).json({ message: 'Permiso creado y asignado al usuario exitosamente', permisoId });
        }
      } catch (error) {
        console.error('Error al guardar los datos', error);
        return res.status(500).json({ message: 'Error al guardar los datos' });
      }
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  } catch (error) {
    console.error('Error al obtener la conexión:', error);
    return res.status(500).json({ message: 'Error al obtener la conexión' });
  } finally {
    if (connection) connection.release();
  }
}