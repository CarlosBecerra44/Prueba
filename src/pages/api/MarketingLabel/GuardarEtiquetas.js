import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const { datosFormulario, pdfUrl } = req.body;

    if (!datosFormulario || !pdfUrl) {
      return res.status(400).json({
        success: false,
        message: 'Los datos del formulario o la URL del PDF no están completos.',
      });
    }

    // Guardar información en la base de datos
    const result = await pool.query(
      'INSERT INTO etiquetas_form (datos_formulario, pdf_path, eliminado, estatus) VALUES ($1, $2, $3, $4) RETURNING *',
      [JSON.stringify(datosFormulario), pdfUrl, false, 'Pendiente']
    );

    console.log('Resultado de la base de datos:', result.rows);

    res.status(200).json({
      success: true,
      message: 'Formulario guardado correctamente.',
      data: result.rows[0], // Devolver el registro guardado
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({
      success: false,
      message: `Error al procesar la solicitud: ${error.message}`,
    });
  }
}