import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuarios } from "./Usuarios.js";

export const Invitaciones = sequelize.define(
  "invitaciones",
  {
    invitacion_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_tesina: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    area_tema: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    resenia_tema: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
    usuario_id_invitado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
    status: {
      type: DataTypes.STRING(15),
      defaultValue: "PENDIENTE",
    },
    fecha_invitacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

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
        model: "usuarios",
        key: "usuario_id",
      },
    },
    usuario_id_alumno: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
    nombre_tesina: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    area_tesina: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    resenia_tesina: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(15),
      defaultValue: "PENDIENTE",
    },
    url_documento: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
        model: "tesinas",
        key: "tesina_id",
      },
    },
    // El nombre del proyecto es el mismo que el de la tesina
    nombre_proyecto: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion_proyecto: {
      type: DataTypes.TEXT,
      allowNull,
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING(15),
      defaultValue: "PENDIENTE",
    },
    url_documento: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

// Relaciones

Usuarios.hasMany(Invitaciones, { foreignKey: "alumno_id" });
Usuarios.hasMany(Invitaciones, { foreignKey: "invitado_id" });

Invitaciones.belongsTo(Usuarios, { as: "Alumno", foreignKey: "alumno_id" });
Invitaciones.belongsTo(Usuarios, { as: "Invitado", foreignKey: "invitado_id" });

Usuarios.hasMany(Tesinas, { foreignKey: "alumno_id" });
Usuarios.hasMany(Tesinas, { foreignKey: "asesor_id" });

Tesinas.belongsTo(Usuarios, { as: "Alumno", foreignKey: "alumno_id" });
Tesinas.belongsTo(Usuarios, { as: "Asesor", foreignKey: "asesor_id" });

Tesinas.hasMany(Proyectos, { foreignKey: "tesina_id" });
Proyectos.belongsTo(Tesinas, { foreignKey: "tesina_id" });
