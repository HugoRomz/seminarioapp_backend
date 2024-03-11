import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { UniqueId } from "../Utils/index.js";
import bcrypt from "bcrypt";

export const Usuarios = sequelize.define(
  "usuarios",
  {
    usuario_id: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido_p: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido_m: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    telefono_usuario: {
      type: DataTypes.STRING(15),
      defaultValue: "SIN",
    },
    email_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(15),
      defaultValue: "ACTIVO",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: UniqueId,
    },
  },
  {
    timestamps: false,
  }
);

Usuarios.beforeSave(async (user, options) => {
  // Verifica si la contraseña ya está hasheada
  if (user.password.startsWith("$2b$")) {
    console.log("La contraseña ya está hasheada");
    // Aquí puedes agregar cualquier lógica adicional que necesites cuando la contraseña ya esté hasheada
  } else {
    // La contraseña no está hasheada, por lo que la hasheamos
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

// Agregar un método al modelo
Usuarios.prototype.checkPassword = async function (inputpassword) {
  return await bcrypt.compare(inputpassword, this.password);
};
