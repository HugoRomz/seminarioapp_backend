import { DataTypes } from "sequelize";

import { sequelize } from "../config/db.js";
import { Usuarios } from "./Usuarios.js";
import { Roles } from "./Roles.js";

export const UsuariosRoles = sequelize.define(
  "usuarios_roles",
  {
    usuario_id: {
      type: DataTypes.STRING(15),
      references: {
        model: Usuarios, // 'Actors' would also work
        key: "usuario_id",
      },
    },
    rol_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Roles, // 'Actors' would also work
        key: "rol_id",
      },
    },
  },
  {
    timestamps: false,
  }
);

Usuarios.belongsToMany(Roles, { through: UsuariosRoles });
Roles.belongsToMany(Usuarios, { through: UsuariosRoles });
