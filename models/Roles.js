import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Roles = sequelize.define(
  "roles",
  {
    rol_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_rol: {
      type: DataTypes.STRING(50),
    },
  },
  {
    timestamps: false,
  }
);
