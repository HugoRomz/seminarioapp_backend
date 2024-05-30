import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Cursos } from "./Cursos.js";
import { Usuarios } from "./Usuarios.js";

export const Documentos = sequelize.define(
  "documentos",
  {
    documento_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_documento: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    destinatario: {
      type: DataTypes.ENUM("alumno", "docente"),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

export const DetallesDocumentosAlumno = sequelize.define(
  "det_doc_alumnos",
  {
    det_alumno_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    documento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "documentos",
        key: "documento_id",
      },
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cursos",
        key: "curso_id",
      },
    },
    egresado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

export const DetallesDocumentosDocente = sequelize.define(
  "det_doc_docentes",
  {
    det_docente_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    documento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "documentos",
        key: "documento_id",
      },
    },
    curso_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cursos",
        key: "curso_id",
      },
    },
  },
  {
    timestamps: false,
  }
);

export const DocumentosAlumnoEstado = sequelize.define(
  "doc_alumnos_estados",
  {
    alumno_estado_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    det_alumno_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "det_doc_alumnos",
        key: "det_alumno_id",
      },
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url_file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url_filePublic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(15),
    },
  },
  {
    timestamps: false,
  }
);

export const DocumentosDocenteEstado = sequelize.define(
  "doc_docente_estados",
  {
    docente_estado_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    det_docente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "det_doc_docentes",
        key: "det_docente_id",
      },
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "usuarios",
        key: "usuario_id",
      },
    },
    comentarios: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url_file: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url_filePublic: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(15),
    },
  },
  {
    timestamps: false,
  }
);

// Relaciones
Documentos.hasMany(DetallesDocumentosAlumno, { foreignKey: "documento_id" });
DetallesDocumentosAlumno.belongsTo(Documentos, { foreignKey: "documento_id" });

Documentos.hasMany(DetallesDocumentosDocente, { foreignKey: "documento_id" });
DetallesDocumentosDocente.belongsTo(Documentos, { foreignKey: "documento_id" });

DetallesDocumentosAlumno.hasMany(DocumentosAlumnoEstado, {
  foreignKey: "det_alumno_id",
});
DocumentosAlumnoEstado.belongsTo(DetallesDocumentosAlumno, {
  foreignKey: "det_alumno_id",
});

DetallesDocumentosDocente.hasMany(DocumentosDocenteEstado, {
  foreignKey: "det_docente_id",
});
DocumentosDocenteEstado.belongsTo(DetallesDocumentosDocente, {
  foreignKey: "det_docente_id",
});

Usuarios.hasMany(DocumentosAlumnoEstado, { foreignKey: "usuario_id" });
DocumentosAlumnoEstado.belongsTo(Usuarios, { foreignKey: "usuario_id" });

Usuarios.hasMany(DocumentosDocenteEstado, { foreignKey: "usuario_id" });
DocumentosDocenteEstado.belongsTo(Usuarios, { foreignKey: "usuario_id" });

Cursos.hasMany(DetallesDocumentosAlumno, { foreignKey: "curso_id" });
DetallesDocumentosAlumno.belongsTo(Cursos, { foreignKey: "curso_id" });

Cursos.hasMany(DetallesDocumentosDocente, { foreignKey: "curso_id" });
DetallesDocumentosDocente.belongsTo(Cursos, { foreignKey: "curso_id" });
