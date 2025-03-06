import FormulariosFaltas from "@/models/FormulariosFaltas"; // Asegúrate de importar el modelo de Sequelize

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { formData, estatus } = req.body;
  const { id } = req.query;
  const estatusForm = formData.estatus ? formData.estatus : estatus;

  try {
    // Usamos el método update de Sequelize para actualizar el registro
    const [updated] = await FormulariosFaltas.update(
      {
        formulario: JSON.stringify(formData),
        estatus: estatusForm,
        fecha_actualizacion: new Date(), // Actualiza la fecha de modificación con el valor actual
      },
      {
        where: { id },
      }
    );

    if (updated > 0) {
      return res.status(201).json({ message: 'Formulario guardado correctamente' });
    } else {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }
  } catch (error) {
    console.error('Error guardando el formulario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}