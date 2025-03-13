import Usuario from "@/models/Usuarios";
import Permiso from "@/models/Permisos";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { userId } = req.query; // Obtiene el id del usuario de los query params
    
    if (!userId) {
      return res.status(400).json({ message: 'El id del usuario es necesario' });
    }

    try {
      // Consulta para obtener el `seccion` y `campo` desde `permiso` para el usuario
      const userPermissions = await Usuario.findOne({
        where: { id: userId },
        include: {
          model: Permiso,
          attributes: ['seccion', 'campo']
        }
      });

      if (!userPermissions) {
        return res.status(404).json({ message: 'No se encontraron permisos para este usuario' });
      }

      // Obtener los permisos del usuario
      let permisos = userPermissions.Permiso;

      // Convertir `campo` a JSON si es necesario
      try {
        permisos.campo = typeof permisos.campo === 'string' ? JSON.parse(permisos.campo) : permisos.campo;
      } catch (error) {
        console.error('Error al parsear permisos.campo:', error);
        permisos.campo = {}; // En caso de error, devolver un objeto vacío
      }

      // Devuelve los permisos del usuario
      console.log("PERMISOS: " + JSON.stringify(permisos))
      res.status(200).json(permisos);
    } catch (error) {
      console.error('Error al obtener permisos', error);
      res.status(500).json({ message: 'Error al obtener permisos' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Método ${req.method} no permitido` });
  }
}