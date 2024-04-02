import Joi from 'joi'

const id = Joi.number().integer();
const nombres = Joi.string().min(3).max(30);
const apellidos = Joi.string().min(3).max(30);
const fechaNacimiento = Joi.date().iso();
const codigoInstitucional = Joi.number().integer();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();
const role = [ 'Profesor' ];
const limit = Joi.number().integer();
const offset = Joi.number().integer();



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

const updateProfesorSchema = Joi.object({
  nombres,
  apellidos,
  fechaNacimiento,
  codigoInstitucional,
  userId
});

const getProfesorSchema = Joi.object({
  id: id.required(),
});

const queryProfesorSchema = Joi.object({
  limit,
  offset,
});

export { createProfesorSchema, updateProfesorSchema, getProfesorSchema, queryProfesorSchema };
