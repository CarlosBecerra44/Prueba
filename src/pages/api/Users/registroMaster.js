import pool from '@/lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { name, lastName, email, employeeNumber, position, selectedDepartamento, password, confirmPassword, role, phoneNumber, entryDate, directBoss, company, workPlant } = req.body;

  const correo = email || null;
  const rol = role || "Estándar";
  const telefono = phoneNumber || null;
  const departamento = selectedDepartamento || null;
  const jefe_directo = directBoss || null;
  const empresa = company || null;

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  let connection;

  try {
    // Obtener la conexión del pool
    connection = await pool.getConnection();

    // Verificar si el usuario ya existe
    const [userExists] = await connection.execute('SELECT * FROM usuarios WHERE correo = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Guardar el nuevo usuario en la base de datos
    const [newUser] = await connection.execute(
      'INSERT INTO usuarios (rol, nombre, numero_empleado, departamento_id, correo, password, apellidos, puesto, telefono, fecha_ingreso, jefe_directo, empresa_id, planta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [rol, name, employeeNumber, departamento, correo, hashedPassword, lastName, position, telefono, entryDate, jefe_directo, empresa, workPlant]
    );

    console.log({ message: 'Usuario registrado' });

    res.status(201).json({ success: true, user: { ...newUser[0], password: undefined } }); // Omitir la contraseña al retornar el usuario
  } catch (error) {
    console.error('Error registrando al usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}