import { sequelize } from "../config/db.js";
import { Roles } from "../models/Roles.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { createAdmin } from "./createAdmin.js";
import { Documentos } from "../models/Documentos.js";
import { Periodos } from "../models/Periodo.js";

await sequelize.authenticate();
const data = {
  roles: [
    {
      nombre_rol: "Administrador",
    },
    {
      nombre_rol: "Alumno",
    },
    {
      nombre_rol: "Docente",
    },
    {
      nombre_rol: "Becario",
    },
    {
      nombre_rol: "Asistente",
    },
  ],
  carreras: [
    {
      nombre_carrera:
        "Licenciatura en Ingeniería en Desarrollo y Tecnologías de Software",
    },
    {
      nombre_carrera: "Ingeniería en Sistemas Computacionales",
    },
  ],
  materias: [
    {
      nombre_materia: "Tecnologías en Operaciones de Negocio",
      descripcion: "Tecnologías en Operaciones de Negocio",
      creditos: 8,
    },
    {
      nombre_materia: "Tópicos de Programación Avanzada",
      descripcion: "Tópicos de Programación Avanzada",
      creditos: 8,
    },
    {
      nombre_materia: "Base de Datos Distribuidas",
      descripcion: "Base de Datos Distribuidas",
      creditos: 8,
    },
    {
      nombre_materia: "Inteligencia de Negocios",
      descripcion: "Inteligencia de Negocios",
      creditos: 8,
    },
    {
      nombre_materia: "Arquitectura SOA y Servicios Web",
      descripcion: "Arquitectura SOA y Servicios Web",
      creditos: 8,
    },
    {
      nombre_materia:
        "Configuración de Servicios de Red con Linux Debian Server",
      descripcion: "Configuración de Servicios de Red con Linux Debian Server",
      creditos: 8,
    },
    {
      nombre_materia: "Conectividad Punto a Punto",
      descripcion: "Conectividad Punto a Punto",
      creditos: 8,
    },
    {
      nombre_materia: "Seguridad de Redes (Hacking Ético)",
      descripcion: "Seguridad de Redes (Hacking Ético)",
      creditos: 8,
    },
    {
      nombre_materia: "Programación de Servicios de Red",
      descripcion: "Programación de Servicios de Red",
      creditos: 8,
    },
    {
      nombre_materia: "Administración de Windows Server 2016",
      descripcion: "Administración de Windows Server 2016",
      creditos: 8,
    },
  ],

  documentos: [
    {
      nombre_documento: "Acta de Nacimiento",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Carta de Aceptación",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Carta de Antecedentes No Penales",
      destinatario: "docente",
    },
    {
      nombre_documento: "Carta de liberación de servicio social",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Carta de pasante",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Carta de Recomendación",
      destinatario: "docente",
    },
    {
      nombre_documento: "Certificado de Capacitación Pedagógica",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Certificado de Estudios",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Cédula Profesional",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Constancia de Situación Fiscal",
      destinatario: "docente",
    },
    {
      nombre_documento: "Comprobante de Domicilio",
      destinatario: "docente",
    },
    {
      nombre_documento: "Comprobante de Nómina",
      destinatario: "docente",
    },
    {
      nombre_documento: "CURP (Clave Única de Registro de Población)",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Historial académico (mínimo 8.0)",
      destinatario: "alumno",
    },
    {
      nombre_documento: "Registro Federal de Contribuyentes (RFC)",
      destinatario: "docente",
    },
    {
      nombre_documento: "Título Profesional",
      destinatario: "alumno",
    },
  ],
  Periodos: [
    {
      descripcion: "ENERO - MAYO",
      fecha_inicio: "2024-01-01 00:00:00-06",
      fecha_fin: "2024-05-11 00:00:00-06",
      status: true,
    },
  ],
};

async function seedDBTest() {
  try {
    await sequelize.transaction(async (t) => {
      await Carreras.bulkCreate(data.carreras, { transaction: t });
      console.log("Las carreras fueron ingresadas correctamente");
      await Materias.bulkCreate(data.materias, { transaction: t });
      console.log("Las materias fueron ingresadas correctamente");
      await Periodos.bulkCreate(data.Periodos, { transaction: t });
      console.log("Los periodos fueron ingresados correctamente");
    });

    console.log("Datos de prueba ingresados correctamente.");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function seedDB() {
  try {
    await sequelize.transaction(async (t) => {
      console.log("Desde seedBD");
      await Roles.bulkCreate(data.roles, { transaction: t });
      console.log("Los roles fueron ingresados correctamente");
      await Documentos.bulkCreate(data.documentos, { transaction: t });
      console.log("Los documentos fueron ingresados correctamente");
    });
    await createAdmin();
    console.log("Usuario sembrado en la base de datos correctamente.");
    console.log("Datos de prueba ingresados correctamente.");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function clearDB() {
  try {
    await sequelize.transaction(async (t) => {
      // eliminar todas las tablas
      await sequelize.sync({ force: true, transaction: t });
      console.log("Todas las tablas fueron eliminadas correctamente.");
    });
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

if (process.argv[2] === "--import") {
  seedDB();
} else if (process.argv[2] === "--import:test") {
  seedDBTest();
} else {
  clearDB();
}
