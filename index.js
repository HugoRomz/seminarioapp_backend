import { sequelize } from "./config/db.js";

import authroutes from "./routes/authRoutes.js";

import express from "express";
import colors from "colors";

// import servicesRoutes from './routes/servicesRoutes.js'

// Configurando la app
const app = express();

//Leer datos via body
app.use(express.json());

// definir las rutas
app.use("/v1-api/", authroutes);

// Puerto
const PORT = process.env.PORT || 4000;

async function main() {
  try {
    await sequelize.sync();
    // await sequelize.authenticate()
    // console.log(colors.yellow('Conexión establecida correctamente con Sequelize.'));
    app.listen(PORT, () => {
      console.log(colors.cyan.bold("El servidor se esta ejecutando:"), PORT);
    });
  } catch (error) {
    console.error(colors.red("Error al conectar con Sequelize:"), error);
  }
}

main();
