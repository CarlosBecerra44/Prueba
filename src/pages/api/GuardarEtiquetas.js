import pool from '@/lib/db';

export default async function guardarFormulario(req, res) {
    if (req.method === 'POST') {
      const { body } = req;
      try {
        const result = await pool.query(
          'INSERT INTO etiquetas_form (datos_formulario) VALUES ($1) RETURNING *',
          [body]
        );
        res.status(200).json({ success: true, data: result.rows[0] });
      } catch (error) {
        console.error('Error al guardar el formulario:', error);
        res.status(500).json({ success: false });
      }
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  }