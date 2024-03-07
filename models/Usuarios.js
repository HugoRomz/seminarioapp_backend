import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";


export const Usuarios = sequelize.define('usuarios',{
    usuario_id: {
        type: DataTypes.STRING(15),
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    apellido_p: {
        type: DataTypes.STRING(50),
        allowNull:false
    },
    apellido_m: {
        type: DataTypes.STRING(50),
        allowNull:false
    },
    telefono_usuario: {
        type: DataTypes.STRING(15),
        defaultValue: "SIN"
    },
    email_usuario: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(15),
        defaultValue: 'ACTIVO'
    },
},{
    timestamps: false
}
);
