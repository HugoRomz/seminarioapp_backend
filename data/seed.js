
import { sequelize } from "../config/db.js";
import roles from './Catalogos.js'
import { Roles } from "../models/Roles.js";


await sequelize.authenticate()

async function seedDB() {
    try {
        console.log("Desde seedBD");
        await Roles.bulkCreate(roles)
        console.log('Los roles fueron ingresados correctamente');
        process.exit()
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

async function clearDB() {
    console.log("Desde clearBD");
}

if (process.argv[2] === "--import") {
    seedDB()
}else{
    clearDB()
}