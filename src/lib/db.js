const mysql = require("mysql2/promise");

// Crear un pool de conexiones
const pool = mysql.createPool({
	host: "aionnet.duckdns.org", // Dirección del host
	user: "aion", // Usuario de la base de datos
	password: "NutriAdmin2035*", // Contraseña
	database: "aionnet_productivo", // Nombre de la base de datos
	port: 3306, // Puerto para MySQL
	waitForConnections: true,
	connectionLimit: 140, // Número máximo de conexiones en el pool
	queueLimit: 0, // Sin límite en la cola de conexiones
});

// Exportar el pool
module.exports = pool;
