import { User, UserSchema } from './user.model.js';

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
}

export {setupModels};