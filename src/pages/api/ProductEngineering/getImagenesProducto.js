import ImagenProducto from '@/models/ImagenesProductos';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID del producto requerido' });
  }

  try {
    // Obtener las imágenes del producto con el ID proporcionado
    const imagenes = await ImagenProducto.findAll({
      where: { producto_id: id },
      attributes: ['ruta']
    });

    // Extraer solo las rutas de las imágenes
    const rutas = imagenes.map(img => img.ruta);

    return res.status(200).json({ success: true, imagenes: rutas });
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    return res.status(500).json({ message: 'Error al obtener imágenes' });
  }
}