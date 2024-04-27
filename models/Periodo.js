import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Cursos } from "./Cursos.js";

export const Periodos = sequelize.define(
    "periodos",
    {
        periodo_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        fecha_fin: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export const CursoPeriodos = sequelize.define(
    "cursos_periodos",
    {
        curso_periodo_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        periodo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'periodos',
                key: 'periodo_id'
            }
        },
        curso_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cursos',
                key: 'curso_id'
            }
        },
    },
    {
        timestamps: false,
    }
);

Periodos.hasMany(CursoPeriodos, { foreignKey: 'periodo_id' });
CursoPeriodos.belongsTo(Periodos, { foreignKey: 'periodo_id' });

Cursos.hasMany(CursoPeriodos, { foreignKey: 'curso_id' });
CursoPeriodos.belongsTo(Cursos, { foreignKey: 'curso_id' });