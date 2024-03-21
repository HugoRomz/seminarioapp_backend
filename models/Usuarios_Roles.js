import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuarios } from "./Usuarios.js";
import { Roles } from "./Roles.js";

export const Usuarios_Roles = sequelize.define(
  "usuarios_roles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    }
  },
  {
    timestamps: false,
  }
);

Usuarios.belongsToMany(Roles, { through: Usuarios_Roles });
Roles.belongsToMany(Usuarios, { through: Usuarios_Roles });
