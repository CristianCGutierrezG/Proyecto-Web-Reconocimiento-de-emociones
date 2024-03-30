import { EmocionSchema, EMOCION_TABLE } from '../models/emocion.model.js'; 
import {sequelize} from '../../libs/sequelize.js';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().createTable(EMOCION_TABLE ,  EmocionSchema);
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(EMOCION_TABLE);
};