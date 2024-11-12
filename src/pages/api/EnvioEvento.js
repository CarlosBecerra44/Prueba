
import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }


  const { formData2 } = req.body;

  try {
      // 1. Guarda el evento en la base de datos
      const result = await pool.query(
        'INSERT INTO registroeventos (tipo, descripcion, id_usuario) VALUES ($1, $2, $3) RETURNING id',
        [formData2.tipo, formData2.descripcion, formData2.id]
      );
  
 // 2. Obtén el id del evento recién creado
 const idEvento = result.rows[0].id;

 // 3. Inserta en la tabla notificación utilizando el id del evento, el departamento y el id del usuario
 await pool.query(
   'INSERT INTO notificacion (id_evento, departamento, id_usuario) VALUES ($1, $2, $3)',
   [idEvento, formData2.dpto, formData2.id]
 );
   
    

    res.status(201).json({ message: 'Evento guardado correctamente' });
  } catch (error) {
    console.error('Error guardando el evento:', error);
    res.status(500).json({ message: 'Error en el servidor', error });
  }
}
