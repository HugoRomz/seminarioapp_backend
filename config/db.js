import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Solo necesario si estás utilizando una base de datos PostgreSQL en un servicio como AWS RDS
    },
  },
});
