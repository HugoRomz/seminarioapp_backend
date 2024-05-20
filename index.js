import { sequelize } from "./config/db.js";

import authroutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import documentosRoutes from "./routes/documentosRoutes.js";
import seminarioRoutes from "./routes/seminarioRoutes.js";
import catalogoRoutes from "./routes/catalogoRoutes.js";

import express from "express";
import colors from "colors";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

// Configurando la app
const app = express();

//Leer datos via body
app.use(express.json());

// //Configurar CORS
const whitelist = [process.env.FRONTEND_URL];

if (process.argv[2] === "--postman") {
  whitelist.push(undefined);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Permite la conexión
      callback(null, true);
    } else {
      // No permitir la conexión
      callback(new Error("Error de CORS"));
    }
  },
};

app.use(cors(corsOptions));

// definir las rutas
app.use("/v1-api/auth", authroutes);
app.use("/v1-api/documentos", documentosRoutes);
app.use("/v1-api/user", userRoutes);
app.use("/v1-api/seminario", seminarioRoutes);
app.use("/v1-api/catalogo", catalogoRoutes);

// Puerto
const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await sequelize.authenticate();
    console.log(
      colors.yellow("Conexión establecida correctamente con Sequelize.")
    );
    app.listen(PORT, () => {
      console.log(colors.cyan.bold("El servidor se esta ejecutando:"), PORT);
    });
  } catch (error) {
    console.error(colors.red("Error al conectar con Sequelize:"), error);
  }
}

main();
