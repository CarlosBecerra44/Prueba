
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }


  const { formData2 } = req.body;

  try {
      const result = await pool.query(
        'INSERT INTO registroeventos (tipo, descripcion, id_usuario, id_departamento) VALUES ($1, $2, $3, $4) RETURNING id',
        [formData2.tipo, formData2.descripcion, formData2.id, formData2.dpto]
      );
  
 const idEvento = result.rows[0].id;

 await pool.query(
  `INSERT INTO notificacion (id_evento, id_usuario)
   SELECT $1, id
   FROM usuarios
   WHERE departamento_id = $2 AND id != $3`,
  [idEvento, formData2.dpto, formData2.id]
);
   
    res.status(201).json({ message: 'Evento guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el evento:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}
