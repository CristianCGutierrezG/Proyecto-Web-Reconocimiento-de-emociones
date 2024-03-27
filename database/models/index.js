import { User, UserSchema } from './user.model.js';
import { Estudiante, EstudianteSchema } from './estudiante.model.js';
import { Profesor, ProfesorSchema } from './profesor.model.js';
import { ProSalud, ProSaludSchema } from './proSalud.model.js';

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Estudiante.init(EstudianteSchema, Estudiante.config(sequelize));
  Profesor.init(ProfesorSchema, Profesor.config(sequelize));
  ProSalud.init(ProSaludSchema, ProSalud.config(sequelize));
  
  //Asociaciones
  User.associate(sequelize.models);
  Estudiante.associate(sequelize.models);
  Profesor.associate(sequelize.models);
  ProSalud.associate(sequelize.models);

}

export {setupModels};