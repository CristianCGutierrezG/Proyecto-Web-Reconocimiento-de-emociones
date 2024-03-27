import { ProfesorSchema, PROFESOR_TABLE } from '../models/profesor.model.js'; 
import { ProSaludSchema, PROSALUD_TABLE }  from '../models/proSalud.model.js'; 
import {sequelize} from '../../libs/sequelize.js';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().createTable(PROSALUD_TABLE ,  ProSaludSchema);
    await sequelize.getQueryInterface().createTable(PROFESOR_TABLE ,  ProfesorSchema);
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(PROSALUD_TABLE);
    await sequelize.getQueryInterface().dropTable(PROFESOR_TABLE);
};