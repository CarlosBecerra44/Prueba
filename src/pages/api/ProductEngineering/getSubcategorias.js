import CategoriaMateriaPrima from '@/models/CategoriasMateriasPrimas';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Obtener todas las categorías de materiales primas ordenadas por ID ascendente
    const subcategorias = await CategoriaMateriaPrima.findAll({
      order: [['id', 'ASC']]
    });

    // Retornar las categorías en formato JSON
    return res.status(200).json({ success: true, subcategorias });
  } catch (error) {
    console.error('Error al obtener las subcategorias:', error);
    return res.status(500).json({ message: 'Error al obtener las subcategorias' });
  }
}