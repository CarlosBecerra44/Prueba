import pool from '@/lib/db'; // Tu conexión a MySQL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }
  
  const { id, formulario } = req.body;
  console.log(formulario);
  console.log("ID: " + id);

  try {
    const [result] = await pool.query(
      "UPDATE empresas SET formulario = ? WHERE id = ?",
      [JSON.stringify(formulario), id]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    return res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
}