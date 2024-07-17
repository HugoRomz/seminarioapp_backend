import { sequelize } from "./config/db.js";

import authroutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import documentosRoutes from "./routes/documentosRoutes.js";
import seminarioRoutes from "./routes/seminarioRoutes.js";
import catalogoRoutes from "./routes/catalogoRoutes.js";
import docentesRoutes from "./routes/docentesRoutes.js";
import alumnoRoutes from "./routes/alumnoRoutes.js";
import evidenciasRouter from "./routes/evidenciasRoutes.js";
import configRouter from "./routes/configRoutes.js";
import tesinaRoutes from "./routes/tesinaRoutes.js"
import express from "express";
import colors from "colors";
import cors from "cors";
import bodyParser from "body-parser";

import dotenv from "dotenv";

import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

// Configurando la app
const app = express();

// Utilizar mas de 1MB
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesDirectory = path.join(__dirname, "public/Documentos");

app.use("/Documentos", express.static(filesDirectory));

// definir las rutas
app.use("/v1-api/auth", authroutes);
app.use("/v1-api/documentos", documentosRoutes);
app.use("/v1-api/user", userRoutes);
app.use("/v1-api/seminario", seminarioRoutes);
app.use("/v1-api/catalogo", catalogoRoutes);
app.use("/v1-api/docentes", docentesRoutes);
app.use("/v1-api/alumnos", alumnoRoutes);
app.use("/v1-api/config", configRouter);
app.use("/v1-api/evidencias", evidenciasRouter);
app.use("/v1-api/tesina", tesinaRoutes);

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
