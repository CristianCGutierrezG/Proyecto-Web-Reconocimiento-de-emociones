import { USER_TABLE, UserSchema } from '../models/user.model.js';
import { sequelize } from '../../libs/sequelize.js';
import { DataTypes } from 'sequelize';

/** @type {import('umzug').MigrationFn<any>} */
export const up = async () => {
    await sequelize.getQueryInterface().addColumn(USER_TABLE, 'recovery_token', {
        field: 'recovery_token',
        allowNull: true,
        type: DataTypes.STRING
    });
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async () => {
    await sequelize.getQueryInterface().removeColumn(USER_TABLE, 'recovery_token')
};
