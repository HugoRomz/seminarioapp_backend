import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { UniqueId } from "../Utils/index.js";
import bcrypt from "bcrypt";
import { CursoPeriodos } from "./Periodo.js";

export const Usuarios = sequelize.define(
  "usuarios",
  {
    usuario_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido_p: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    apellido_m: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    telefono_usuario: {
      type: DataTypes.STRING(15),
      defaultValue: "SIN",
    },
    email_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(15),
      defaultValue: "ACTIVO",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: UniqueId,
    },
  },
  {
    timestamps: true,
  }
);

Usuarios.beforeSave(async (user, options) => {
  if (user.password.startsWith("$2b$")) {
    console.log("La contraseña ya está hasheada");
  } else {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

Usuarios.beforeUpdate(async (user, options) => {
  if (user.password.startsWith("$2b$")) {
    console.log("La contraseña ya está hasheada");
  } else {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

Usuarios.prototype.checkPassword = async function (inputpassword) {
  return await bcrypt.compare(inputpassword, this.password);
};

export const Alumno = sequelize.define("alumnos", {
  matricula: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  calificacionFinal: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 5,
      max: 8,
    },
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
});

// Relación uno a uno entre Usuarios y Alumno
Usuarios.hasOne(Alumno, { foreignKey: "usuario_id" });
Alumno.belongsTo(Usuarios, { foreignKey: "usuario_id" });

export const Docente = sequelize.define("docentes", {
  num_plaza: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  licenciatura: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  maestria: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  doctorado: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
});

// Relación uno a uno entre Usuarios y Docente
Usuarios.hasOne(Docente, { foreignKey: "usuario_id" });
Docente.belongsTo(Usuarios, { foreignKey: "usuario_id" });

export const Egresado = sequelize.define("egresados", {
  cod_egresado: {
    type: DataTypes.STRING(50),
    primaryKey: true,
    allowNull: false,
  },
  trabajando: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  especializado: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  calificacionFinal: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
    validate: {
      min: 5,
      max: 8,
    },
  },
  usuario_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
});

// Relación uno a uno entre Usuarios y Egresado
Usuarios.hasOne(Egresado, { foreignKey: "usuario_id" });
Egresado.belongsTo(Usuarios, { foreignKey: "usuario_id" });

export const UserPreregister = sequelize.define(
  "preregistro",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_estudiante: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    email_usuario: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "SIN DEFINIR",
    },
    carrera: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    egresado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    trabajando: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    curso_periodo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CursoPeriodos,
        key: "curso_periodo_id",
      },
    },
    checkSeminario: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    anio_egreso: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    lugar_trabajo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    timestamps: false,
  }
);

// Definir la relación con cursos_periodos
UserPreregister.belongsTo(CursoPeriodos, { foreignKey: "curso_periodo_id" });
