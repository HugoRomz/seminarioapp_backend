import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Carreras = sequelize.define(
    "carreras",
    {
        carrera_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_carrera: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

