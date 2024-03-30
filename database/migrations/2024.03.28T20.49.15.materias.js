import { MateriasSchema, MATERIAS_TABLE } from '../models/materias.model.js'; 
import { EstudiantesMateriasSchema, ESTUDIANTES_MATERIAS_TABLE } from '../models/materias-estudiantes.model.js'; 
import {sequelize} from '../../libs/sequelize.js';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().createTable(MATERIAS_TABLE ,  MateriasSchema);
    await sequelize.getQueryInterface().createTable(ESTUDIANTES_MATERIAS_TABLE ,  EstudiantesMateriasSchema);
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(ESTUDIANTES_MATERIAS_TABLE);
    await sequelize.getQueryInterface().dropTable(MATERIAS_TABLE);
};