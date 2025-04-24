const mysql = require('mysql2/promise');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost', // Dirección del host
  user: 'root',      // Usuario de la base de datos
  password: '', // Contraseña
  database: 'prueba', // Nombre de la base de datos
  port: 3306,           // Puerto para MySQL
  waitForConnections: true,
  connectionLimit: 140,  // Número máximo de conexiones en el pool
  queueLimit: 0         // Sin límite en la cola de conexiones
});

// Exportar el pool
module.exports = pool;