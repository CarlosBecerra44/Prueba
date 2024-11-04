import pool from '@/lib/db';

export default async function handler(req, res) {
  const { id: userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'El id del usuario es necesario' });
  }

  if (req.method === 'GET') {
    try {
      // Consulta para traer los permisos ya existentes para el usuario
      const existingPermisoQuery = `
        SELECT id, seccion, campo FROM permiso
        WHERE id = (
          SELECT id_permiso FROM usuarios WHERE id = $1
        )
      `;
      const existingPermisoResult = await pool.query(existingPermisoQuery, [userId]);

      if (existingPermisoResult.rows.length > 0) {
        return res.status(200).json({
          message: 'Permisos existentes encontrados',
          permiso: existingPermisoResult.rows[0],
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
      // Código para insertar o actualizar permisos si no existen
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
          SELECT id_permiso FROM usuarios WHERE id = $1
        )
      `;
      const existingPermisoResult = await pool.query(existingPermisoQuery, [userId]);

      if (existingPermisoResult.rows.length > 0) {
        const permisoQuery = `
        UPDATE permiso SET seccion = seccion::jsonb || $1::jsonb, campo = campo::jsonb || $2::jsonb WHERE id = (
          SELECT id_permiso FROM usuarios WHERE id = $3
        )
      `;

      const permisoResult = await pool.query(permisoQuery, [seccionJson, campoJson, userId]);

      return res.status(200).json({
        message: 'Permisos del usuario actualizados correctamente',
        permisoResult,
      });
      } else {
        const permisoQuery = `
        INSERT INTO permiso (seccion, campo)
        VALUES ($1, $2)
        RETURNING id;
      `;

      const permisoResult = await pool.query(permisoQuery, [seccionJson, campoJson]);
      const permisoId = permisoResult.rows[0].id;

      const userQuery = `
        UPDATE usuarios
        SET id_permiso = $1
        WHERE id = $2;
      `;
      await pool.query(userQuery, [permisoId, userId]);

      return res.status(200).json({
        message: 'Permiso creado y asignado al usuario exitosamente',
        permisoId,
      });
      }
    } catch (error) {
      console.error('Error al guardar los datos', error);
      return res.status(500).json({ message: 'Error al guardar los datos' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
