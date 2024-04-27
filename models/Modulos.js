import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { DetalleCurso } from "./Cursos.js"; 
import { Usuarios } from "./Usuarios.js"; 
import { CursoPeriodos } from "./Periodo.js"; 

export const Modulos = sequelize.define(
    "modulos",
    {
        modulo_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        det_curso_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'det_cursos',
                key: 'det_curso_id'
            }
        },
        usuario_id: {
            type: DataTypes.UUID, // Cambiado a UUID
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'usuario_id'
            }
        },
        nombre_modulo: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        fecha_inicio: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        fecha_cierre: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        curso_periodo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'cursos_periodos',
                key: 'curso_periodo_id'
            }
        },
    },
    {
        timestamps: false,
    }
);

export const Calificaciones = sequelize.define(
    "calificaciones",
    {
        calificacion_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        modulo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'modulos',
                key: 'modulo_id'
            }
        },
        usuario_id: {
            type: DataTypes.UUID, // Cambiado a UUID
            allowNull: false,
            references: {
                model: 'usuarios',
                key: 'usuario_id'
            }
        },
        calificacion: {
            type: DataTypes.INTEGER,
            defaultValue: 5,
            validate: {
                min: 0,
                max: 10,
            },
        },
    },
    {
        timestamps: false,
    }
);

// Relaciones
Modulos.hasMany(Calificaciones, { foreignKey: 'modulo_id' });
Calificaciones.belongsTo(Modulos, { foreignKey: 'modulo_id' });

Usuarios.hasMany(Calificaciones, { foreignKey: 'usuario_id' });
Calificaciones.belongsTo(Usuarios, { foreignKey: 'usuario_id' });

Modulos.belongsTo(DetalleCurso, { foreignKey: 'det_curso_id' });
DetalleCurso.hasMany(Modulos, { foreignKey: 'det_curso_id' });

Modulos.belongsTo(Usuarios, { foreignKey: 'usuario_id' });

Modulos.belongsTo(CursoPeriodos, { foreignKey: 'curso_periodo_id' });
CursoPeriodos.hasMany(Modulos, { foreignKey: 'curso_periodo_id' });
