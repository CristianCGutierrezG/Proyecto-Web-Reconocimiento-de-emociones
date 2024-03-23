import { UserSchema, USER_TABLE } from '../models/user.model.js';
import {sequelize} from '../../libs/sequelize.js';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().addColumn(USER_TABLE, 'role', UserSchema.role);
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().removeColumn(USER_TABLE, 'role');
};