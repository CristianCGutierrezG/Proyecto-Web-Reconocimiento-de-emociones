import { UserSchema, USER_TABLE } from '../models/user.model.js';
import {sequelize} from '../../libs/sequelize.js';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().createTable(USER_TABLE, UserSchema);
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().dropTable(USER_TABLE);
};