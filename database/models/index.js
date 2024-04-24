import { User, UserSchema } from './user.model.js';
import { Estudiante, EstudianteSchema } from './estudiante.model.js';
import { Profesor, ProfesorSchema } from './profesor.model.js';
import { ProSalud, ProSaludSchema } from './proSalud.model.js';
import { Emocion, EmocionSchema } from './emocion.model.js';
import { Materias, MateriasSchema } from './materias.model.js';
import { EstudiantesMaterias, EstudiantesMateriasSchema } from './materias-estudiantes.model.js'; 
import { Horarios, HorariosSchema } from './horario.model.js';

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Estudiante.init(EstudianteSchema, Estudiante.config(sequelize));
  Profesor.init(ProfesorSchema, Profesor.config(sequelize));
  ProSalud.init(ProSaludSchema, ProSalud.config(sequelize));
  Emocion.init(EmocionSchema, Emocion.config(sequelize) );
  Materias.init(MateriasSchema, Materias.config(sequelize) );
  EstudiantesMaterias.init(EstudiantesMateriasSchema, EstudiantesMaterias.config(sequelize));
  Horarios.init(HorariosSchema, Horarios.config(sequelize) );

  
  //Asociaciones
  User.associate(sequelize.models);
  Estudiante.associate(sequelize.models);
  Profesor.associate(sequelize.models);
  ProSalud.associate(sequelize.models);
  Emocion.associate(sequelize.models);
  Materias.associate(sequelize.models);
  Horarios.associate(sequelize.models);
}

export {setupModels};