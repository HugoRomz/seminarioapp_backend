import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Modulos } from "./Modulos.js";

export const TipoEvidencias = sequelize.define(
    "tipo_evidencias",
    {
        tipo_evidencia_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre_tipo_ev: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export const Evidencias = sequelize.define(
    "evidencias",
    {
        evidencia_id: {
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
        tipo_evidencia_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'tipo_evidencias',
                key: 'tipo_evidencia_id'
            }
        },
        nombre_evidencia: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        descripcion_evi: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

export const DetalleEvidencias = sequelize.define(
    "detalle_evidencias",
    {
        cns_detalle_evidencias: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        evidencia_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'evidencias',
                key: 'evidencia_id'
            }
        },
        url_evidencia: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

// Relaciones
TipoEvidencias.hasMany(Evidencias, { foreignKey: 'tipo_evidencia_id' });
Evidencias.belongsTo(TipoEvidencias, { foreignKey: 'tipo_evidencia_id' });

Evidencias.hasMany(DetalleEvidencias, { foreignKey: 'evidencia_id' });
DetalleEvidencias.belongsTo(Evidencias, { foreignKey: 'evidencia_id' });

Modulos.hasMany(Evidencias, { foreignKey: 'modulo_id' });
Evidencias.belongsTo(Modulos, { foreignKey: 'modulo_id' });
