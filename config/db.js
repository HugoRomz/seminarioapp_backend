import { Sequelize } from "sequelize";

import dotenv  from "dotenv";
dotenv.config()

export const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});