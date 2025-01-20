import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  // Configuración de la conexión
  const dbConfig = {
    host: '50.6.199.166', // Cambia esto al host de tu base de datos
    user: 'aionnet', // Usuario de la base de datos
    password: '$ZkSex&+PSbQ', // Contraseña de la base de datos
    database: 'aionnet_pruebas', // Nombre de la base de datos
    ssl: false, // Desactiva SSL temporalmente
  };

  try {
    // Crear una conexión
    const connection = await mysql.createConnection(dbConfig);

    // Ejecutar una consulta de prueba
    const [rows] = await connection.query('SELECT 1 + 1 AS result');

    // Cerrar la conexión
    await connection.end();

    // Devolver el resultado
    res.status(200).json({ success: true, result: rows[0].result });
  } catch (error) {
    console.error('Error conectando a la base de datos:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
}