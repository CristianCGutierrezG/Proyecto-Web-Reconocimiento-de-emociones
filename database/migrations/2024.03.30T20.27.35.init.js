import { USER_TABLE, UserSchema } from '../models/user.model.js';
import { ESTUDIANTE_TABLE, EstudianteSchema} from '../models/estudiante.model.js';
import { PROFESOR_TABLE , ProfesorSchema} from '../models/profesor.model.js';
import { EMOCION_TABLE, EmocionSchema } from '../models/emocion.model.js';
import { PROSALUD_TABLE, ProSaludSchema } from '../models/proSalud.model.js';
import { MATERIAS_TABLE, MateriasSchema } from '../models/materias.model.js';
import { ESTUDIANTES_MATERIAS_TABLE, EstudiantesMateriasSchema } from '../models/materias-estudiantes.model.js';
import { HORARIOS_TABLE, HorariosSchema } from '../models/horario.model.js';
import { sequelize } from '../../libs/sequelize.js';

export const up = async () => {
    await sequelize.getQueryInterface().createTable(USER_TABLE, UserSchema);
    await sequelize.getQueryInterface().createTable(ESTUDIANTE_TABLE, EstudianteSchema);
    await sequelize.getQueryInterface().createTable(PROFESOR_TABLE , ProfesorSchema);
    await sequelize.getQueryInterface().createTable(EMOCION_TABLE , EmocionSchema);
    await sequelize.getQueryInterface().createTable(PROSALUD_TABLE , ProSaludSchema);
    await sequelize.getQueryInterface().createTable(MATERIAS_TABLE , MateriasSchema);
    await sequelize.getQueryInterface().createTable(ESTUDIANTES_MATERIAS_TABLE , EstudiantesMateriasSchema);
    await sequelize.getQueryInterface().createTable(HORARIOS_TABLE , HorariosSchema);
}; 

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(HORARIOS_TABLE);
    await sequelize.getQueryInterface().dropTable(ESTUDIANTES_MATERIAS_TABLE);
    await sequelize.getQueryInterface().dropTable(MATERIAS_TABLE);
    await sequelize.getQueryInterface().dropTable(EMOCION_TABLE);
    await sequelize.getQueryInterface().dropTable(PROFESOR_TABLE);
    await sequelize.getQueryInterface().dropTable(PROSALUD_TABLE);
    await sequelize.getQueryInterface().dropTable(ESTUDIANTE_TABLE);
    await sequelize.getQueryInterface().dropTable(USER_TABLE);
};
