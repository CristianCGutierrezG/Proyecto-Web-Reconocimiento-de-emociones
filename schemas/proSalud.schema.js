import Joi from 'joi'

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos del profesional de salud
*/ 

const id = Joi.number().integer();
const nombres = Joi.string().min(3).max(30);
const apellidos = Joi.string().min(3).max(30);
const fechaNacimiento = Joi.date().iso();
const codigoInstitucional =  Joi.string().min(9).max(12);
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();
const role = [ 'Profesional de salud' ];
const activo = Joi.boolean();
const limit = Joi.number().integer();
const offset = Joi.number().integer();

//Schema para crear un proSalud con la informacion de su usuario 
const createProSaludSchema = Joi.object({
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

//Schema para actualizar un proSalud
const updateProSaludSchema = Joi.object({
  nombres,
  apellidos,
  fechaNacimiento,
  codigoInstitucional,
  userId,
  activo
});

//Schema para obtener un proSalud por su id
const getProSaludSchema = Joi.object({
  id: id.required(),
});

//Schema para obtener un numero de proSalud definido
const queryProSaludSchema = Joi.object({
  limit,
  offset,
});


export { createProSaludSchema, updateProSaludSchema, getProSaludSchema, queryProSaludSchema };