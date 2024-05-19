import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Materias = sequelize.define(
  "materias",
  {
    materia_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_materia: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    creditos: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
