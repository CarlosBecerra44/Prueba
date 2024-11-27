// pages/api/register.js
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { redirect } from 'next/dist/server/api-utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, lastName, email, employeeNumber, position, selectedDepartamento, password, confirmPassword, role, phoneNumber, entryDate, directBoss, company } = req.body;

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el nuevo usuario en la base de datos
    const newUser = await pool.query(
      'INSERT INTO usuarios (rol, nombre, numero_empleado, departamento_id, correo, password, apellidos, puesto, telefono, fecha_ingreso, jefe_directo, empresa_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
      [role, name, employeeNumber, selectedDepartamento, email, hashedPassword, lastName, position, phoneNumber, entryDate, directBoss, company]
    );

    console.log({message: 'usuario registrado'});

    res.status(201).json({ success: true, user: newUser.rows[0] });
  } catch (error) {
    console.error('Error registrando al usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}
