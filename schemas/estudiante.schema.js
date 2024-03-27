import Joi from 'joi'

const id = Joi.number().integer();
const nombres = Joi.string().min(3).max(30);
const apellidos = Joi.string().min(3).max(30);
const fechaNacimiento = Joi.date().iso();
const codigoInstitucional = Joi.number().integer();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();


const createEstudianteSchema = Joi.object({
  nombres: nombres.required(),
  apellidos: apellidos.required(),
  fechaNacimiento: fechaNacimiento.required(),
  codigoInstitucional: codigoInstitucional.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required()
  })
});

const updateEstudianteSchema = Joi.object({
  nombres,
  apellidos,
  fechaNacimiento,
  codigoInstitucional,
  userId
});

const getEstudianteSchema = Joi.object({
  id: id.required(),
});

export { createEstudianteSchema, updateEstudianteSchema, getEstudianteSchema };
