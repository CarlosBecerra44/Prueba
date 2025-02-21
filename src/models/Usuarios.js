import { DataTypes } from "sequelize";
import sequelize from "@/lib/sequelize"; // Asegúrate de tener tu conexión en este archivo

const Usuario = sequelize.define(
  "Usuario",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    rol: { type: DataTypes.STRING },
    nombre: { type: DataTypes.STRING },
    apellidos: { type: DataTypes.STRING },
    numero_empleado: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING, unique: true },
    departamento_id: { type: DataTypes.INTEGER },
    id_permiso: { type: DataTypes.INTEGER },
    puesto: { type: DataTypes.STRING },
    telefono: { type: DataTypes.INTEGER },
    fecha_ingreso: { type: DataTypes.DATE },
    jefe_directo: { type: DataTypes.INTEGER },
    empresa_id: { type: DataTypes.INTEGER },
    planta: { type: DataTypes.INTEGER },
    password: { type: DataTypes.STRING },
    eliminado: { type: DataTypes.INTEGER },
  },
  {
    tableName: "usuarios",
    timestamps: false, // Si tu tabla no usa `createdAt` y `updatedAt`
  }
);

export default Usuario;