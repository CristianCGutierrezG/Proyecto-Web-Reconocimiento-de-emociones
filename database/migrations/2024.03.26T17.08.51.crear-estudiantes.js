import { EstudianteSchema, ESTUDIANTE_TABLE } from '../models/estudiante.model.js'; 
import {sequelize} from '../../libs/sequelize.js';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().createTable(ESTUDIANTE_TABLE ,  EstudianteSchema);
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(ESTUDIANTE_TABLE );
};