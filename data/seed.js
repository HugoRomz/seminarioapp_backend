import { sequelize } from "../config/db.js";
import { Roles } from "../models/Roles.js";
import { Carreras } from "../models/Carreras.js";
import { Materias } from "../models/Materias.js";
import { createAdmin } from "./createAdmin.js";

await sequelize.authenticate();
const data = {
  roles: [
    {
      nombre_rol: "Administrador",
    },
    {
      nombre_rol: "alumno",
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
    },
    {
      nombre_materia: "Tópicos de Programación Avanzada",
    },
    {
      nombre_materia: "Base de Datos Distribuidas",
    },
    {
      nombre_materia: "Inteligencia de Negocios",
    },
    {
      nombre_materia: "Arquitectura SOA y Servicios Web",
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
