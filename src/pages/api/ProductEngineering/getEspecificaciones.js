import SubcategoriaMateriaPrima from '@/models/SubcategoriasMateriasPrimas';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Obtener todas las subcategorías ordenadas por ID ascendente
    const especificaciones = await SubcategoriaMateriaPrima.findAll({
      order: [['id', 'ASC']]
    });

    // Retornar las especificaciones en formato JSON
    return res.status(200).json({ success: true, especificaciones });
  } catch (error) {
    console.error('Error al obtener las especificaciones:', error);
    return res.status(500).json({ message: 'Error al obtener las especificaciones' });
  }
}