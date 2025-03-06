import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize";

const TipoMateriaPrima = sequelize.define(
  "TipoMateriaPrima",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "tiposmaterialesprima",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default TipoMateriaPrima;