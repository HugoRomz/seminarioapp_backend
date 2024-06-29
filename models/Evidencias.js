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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export const Actividad = sequelize.define(
  "actividades",
  {
    actividad_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    modulo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "modulos",
        key: "modulo_id",
      },
    },
    tipo_evidencia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tipo_evidencias",
        key: "tipo_evidencia_id",
      },
    },
    nombre_actividad: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
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
    evidencias_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    actividad_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "actividades",
        key: "actividad_id",
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url_evidencia: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url_evidenciaPublic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

// Relaciones
TipoEvidencias.hasMany(Actividad, { foreignKey: "tipo_evidencia_id" });
Actividad.belongsTo(TipoEvidencias, { foreignKey: "tipo_evidencia_id" });

Actividad.hasMany(Evidencias, { foreignKey: "actividad_id" });
Evidencias.belongsTo(Actividad, { foreignKey: "actividad_id" });

Modulos.hasMany(Actividad, { foreignKey: "modulo_id" });
Actividad.belongsTo(Modulos, { foreignKey: "modulo_id" });
