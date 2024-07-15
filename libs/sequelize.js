import { Sequelize, Op }  from "sequelize";

import { config } from "../config/config.js";
import { setupModels } from "../database/models/index.js";


const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

const sequelize = new Sequelize(URI,{
    dialect: 'postgres',
    logging: false
});


setupModels(sequelize)

export {sequelize, Op}