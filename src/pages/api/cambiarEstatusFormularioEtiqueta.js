import db from '@/lib/db'; // Asegúrate de tener tu conexión a la base de datos configurada.

export default async function handler(req, res) {
  const { id, nuevoEstatus } = req.body;

  if (req.method === 'POST') {
    try {
      // Suponiendo que estás usando una base de datos relacional como MySQL o Postgres
      const resultado = await db.query(
        'UPDATE etiquetas_form SET estatus = $1 WHERE id = $2',
        [nuevoEstatus, id]
      );

      if (resultado.rowCount === 1) {
        res.status(200).json({ message: 'Estatus actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Formulario no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el estatus:', error);
      res.status(500).json({ message: 'Error al actualizar el estatus' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
