import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const Identificador = sequelize.define(
  "Identificador",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
    no_articulo: { type: DataTypes.STRING, allowNull: true },
    categoria: { type: DataTypes.STRING, allowNull: true },
    linea: { type: DataTypes.STRING, allowNull: true },
    formato: { type: DataTypes.STRING, allowNull: true },
    presentacion_sugerida: { type: DataTypes.STRING, allowNull: true },
    ingredientes: { type: DataTypes.STRING, allowNull: true },
    modo_empleo: { type: DataTypes.STRING, allowNull: true },
    funcion_principal: { type: DataTypes.STRING, allowNull: true },
    funcion_especifica: { type: DataTypes.STRING, allowNull: true },
    recomendado_para: { type: DataTypes.STRING, allowNull: true },
    productos_complementarios: { type: DataTypes.STRING, allowNull: true },
    medicion: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "identificadores",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Identificador;