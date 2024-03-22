import { sequelize } from "./config/db.js";

import authroutes from "./routes/authRoutes.js";

import express from "express";
import colors from "colors";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

// Configurando la app
const app = express();

//Leer datos via body
app.use(express.json());

//Configurar CORS
const whitelist = [process.env.FRONTEND_URL, undefined];
console.log();

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Error de cors"));
//     }
//   },
// };

const corsOptions = {
  origin: true, // Aceptar todas las rutas
};

app.use(cors(corsOptions));

// definir las rutas
app.use("/v1-api/auth", authroutes);

// Puerto
const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await sequelize.authenticate()
    console.log(colors.yellow('Conexión establecida correctamente con Sequelize.'));
    app.listen(PORT, () => {
      console.log(colors.cyan.bold("El servidor se esta ejecutando:"), PORT);
    });
  } catch (error) {
    console.error(colors.red("Error al conectar con Sequelize:"), error);
  }
}

main();
