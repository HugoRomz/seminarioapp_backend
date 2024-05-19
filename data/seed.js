import { sequelize } from "../config/db.js";
import { Roles } from "../models/Roles.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { createAdmin } from "./createAdmin.js";
import { Documentos } from "../models/Documentos.js";

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
      nombre_rol: "becario",
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
  ],

  documentos: [
    {
      nombre_documento: "Acta de Nacimiento",
    },
    {
      nombre_documento: "Carta de Aceptación",
    },
    {
      nombre_documento: "Carta de Antecedentes No Penales",
    },
    {
      nombre_documento: "Carta de liberación de servicio social",
    },
    {
      nombre_documento: "Carta de pasante",
    },
    {
      nombre_documento: "Carta de Recomendación",
    },
    {
      nombre_documento: "Certificado de Capacitación Pedagógica",
    },
    {
      nombre_documento: "Certificado de Estudios",
    },
    {
      nombre_documento: "Cédula Profesional",
    },
    {
      nombre_documento: "CONSTANCIA DE SITUACION FISCAL",
    },
    {
      nombre_documento: "Comprobante de Domicilio",
    },
    {
      nombre_documento: "Comprobante de Nómina",
    },
    {
      nombre_documento: "CURP (Clave Única de Registro de Población)",
    },
    {
      nombre_documento: "Cedula Profesional",
    },
    {
      nombre_documento: "Historial académico (mínimo 8.0)",
    },
    {
      nombre_documento: "Registro Federal de Contribuyentes (RFC)",
    },
    {
      nombre_documento: "Título Profesional",
    },
  ],
};

async function seedDB() {
  try {
    console.log("Desde seedBD");
    await Roles.bulkCreate(data.roles);
    console.log("Los roles fueron ingresados correctamente");
    await Carreras.bulkCreate(data.carreras);
    console.log("Las carreras fueron ingresadas correctamente");
    await Materias.bulkCreate(data.materias);
    console.log("Las materias fueron ingresadas correctamente");
    await Documentos.bulkCreate(data.documentos);
    await createAdmin();
    console.log("Usuario sembrado en la base de datos correctamente.");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function clearDB() {
  console.log("Desde clearBD");
}

if (process.argv[2] === "--import") {
  seedDB();
} else {
  clearDB();
}
