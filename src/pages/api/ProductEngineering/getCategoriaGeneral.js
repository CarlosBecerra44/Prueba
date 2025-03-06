import TipoMateriaPrima from "@/models/TiposMateriasPrimas";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Obtener todas las categorías ordenadas por ID ascendente
    const categorias = await TipoMateriaPrima.findAll({
      order: [['id', 'ASC']]
    });

    // Retornar las categorías en formato JSON
    return res.status(200).json({ success: true, categorias });
  } catch (error) {
    console.error('Error al obtener las categorías:', error);
    return res.status(500).json({ message: 'Error al obtener las categorías' });
  }
}