import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuarios } from "./Usuarios.js";

export const Tesinas = sequelize.define(
    "tesinas",
    {
        tesina_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        usuario_id_docente: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'usuario_id'
            }
        },
        usuario_id_alumno: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'usuario_id'
            }
        },
        nombre_tesina: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        descripcion_tesina: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        fecha_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.STRING(15),
            defaultValue: 'REVISION',
        },
        calificacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 2,
            },
        },
    },
    {
        timestamps: false,
    }
);

export const Proyectos = sequelize.define(
    "proyectos",
    {
        proyecto_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tesina_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tesinas',
                key: 'tesina_id'
            }
        },
        nombre_proyecto: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        fecha_final: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: false,
    }
);

// Relaciones
Tesinas.hasOne(Proyectos, { foreignKey: 'tesina_id' });
Proyectos.belongsTo(Tesinas, { foreignKey: 'tesina_id' });

// Relación con la tabla Usuarios
Usuarios.hasMany(Tesinas, { foreignKey: 'usuario_id_docente' });
Tesinas.belongsTo(Usuarios, { foreignKey: 'usuario_id_docente' });

Usuarios.hasMany(Tesinas, { foreignKey: 'usuario_id_alumno' });
Tesinas.belongsTo(Usuarios, { foreignKey: 'usuario_id_alumno' });
