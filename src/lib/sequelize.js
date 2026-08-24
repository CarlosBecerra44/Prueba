const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("aionnet_pruebas", "aion", "NutriAdmin2035*", {
	host: "aionnet.duckdns.org", // Cambia esto según tu servidor
	dialect: "mysql",
	port: 3306, // Cambia a "mysql", "sqlite" o "mssql" según tu BD
	dialectModule: require("mysql2"),
});

// bases de datos
// "aionnet_pruebas", "aionnet", "Rrio1003*","50.6.199.166"

(async () => {
	try {
		await sequelize.authenticate();
		console.log("Conexión establecida correctamente.");
	} catch (error) {
		console.error("Error de conexión:", error);
	}
})();

module.exports = sequelize;
