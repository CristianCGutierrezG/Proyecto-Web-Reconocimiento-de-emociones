import Joi from 'joi'

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos del profesor
*/ 

const id = Joi.number().integer();
const nombres = Joi.string().min(3).max(30);
const apellidos = Joi.string().min(3).max(30);
const fechaNacimiento = Joi.date().iso();
const codigoInstitucional = Joi.number().integer();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();
const role = [ 'Profesor'];
const limit = Joi.number().integer();
const offset = Joi.number().integer();

//Schema para crear un profesor con la informacion de su usuario 
const createProfesorSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  fechaNacimiento: fechaNacimiento.required(),
  codigoInstitucional: codigoInstitucional.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required(),
    role: Joi.string().valid(...role).required()
  })
});

//Schema para actualizar un profesor
const updateProfesorSchema = Joi.object({
  nombres,
  apellidos,
  fechaNacimiento,
  codigoInstitucional,
  userId
});

//Schema para obtener un estudiante por su id
const getProfesorSchema = Joi.object({
  id: id.required(),
});

//Schema para obtener un numero de profesores definido
const queryProfesorSchema = Joi.object({
  limit,
  offset,
});

export { createProfesorSchema, updateProfesorSchema, getProfesorSchema, queryProfesorSchema };
