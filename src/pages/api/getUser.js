import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo } = req.body;

    try {
      const query = 'SELECT * FROM usuarios WHERE correo = $1';
      const values = [correo];
      const result = await pool.query(query, values);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        const idUser = user.departamento_id;
        
        const query2 = 'SELECT * FROM departamentos WHERE id = $1';
        const values = [idUser];
        const result2 = await pool.query(query2, values);

        if(result2.rows.length > 0) {
          const departamento = result2.rows[0];
          return res.status(200).json({ success: true, user, departamento });
        }
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error en el servidor:', error);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  } else {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }
}
