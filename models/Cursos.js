import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Carreras } from "./Carreras.js";
import { Materias } from './Materias.js';

export const Cursos = sequelize.define(
    "cursos",
    {
        curso_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_curso: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        carrera_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'carreras',
                key: 'carrera_id'
            }
        },
    },
    {
        timestamps: false,
    }
);

export const DetalleCurso = sequelize.define(
    "det_cursos",
    {
        det_curso_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        curso_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cursos',
                key: 'curso_id'
            }
        },
        materia_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'materias',
                key: 'materia_id'
            }
        },
    },
    {
        timestamps: false,
    }
);

// Relaciones
Cursos.hasMany(DetalleCurso, { foreignKey: 'curso_id' });
DetalleCurso.belongsTo(Cursos, { foreignKey: 'curso_id' });

Carreras.hasMany(Cursos, { foreignKey: 'carrera_id' });
Cursos.belongsTo(Carreras, { foreignKey: 'carrera_id' });

DetalleCurso.belongsTo(Materias, { foreignKey: 'materia_id' });
Materias.hasMany(DetalleCurso, { foreignKey: 'materia_id' });