import { sequelize } from "../config/db.js";
import { Roles } from "../models/Roles.js";
import { createAdmin } from "./createAdmin.js";

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
};

async function seedDB() {
  try {
    console.log("Desde seedBD");
    await Roles.bulkCreate(data.roles);
    console.log("Los roles fueron ingresados correctamente");
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
