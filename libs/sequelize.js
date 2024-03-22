import { Sequelize }  from "sequelize";

import { config } from "../config/config.js";
import { setupModels } from "../database/models/index.js";


const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

const sequelize = new Sequelize(URL,{
    dialect: 'postgres',
    logging: false
});


setupModels(sequelize)
sequelize.sync();

export {sequelize}