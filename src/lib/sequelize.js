const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("prueba", "root", "", {
  host: "localhost", // Cambia esto según tu servidor
  dialect: "mysql", // Cambia a "mysql", "sqlite" o "mssql" según tu BD
  dialectModule: require("mysql2"),
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
  } catch (error) {
    console.error("Error de conexión:", error);
  }
})();

module.exports = sequelize;