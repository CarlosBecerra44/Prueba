const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("aionnet_pruebas", "root", "", {
  host: "localhost", // Cambia esto según tu servidor
  dialect: "mysql", // Cambia a "mysql", "sqlite" o "mssql" según tu BD
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
  } catch (error) {
    console.error("Error de conexión:", error);
  }
})();