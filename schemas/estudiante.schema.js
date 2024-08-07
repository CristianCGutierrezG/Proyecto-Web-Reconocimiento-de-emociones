import Joi from 'joi'

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos del estudiante
*/ 

const id = Joi.number().integer();
const nombres = Joi.string().min(3).max(30);
const apellidos = Joi.string().min(3).max(30);
const fechaNacimiento = Joi.date().iso();
const codigoInstitucional = Joi.string().min(9).max(12);
const userId = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string();
const activo = Joi.boolean();
const limit = Joi.number().integer();
const offset = Joi.number().integer();


//Schema para crear un estudiante con la informacion de su usuario 
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

//Schema para actualizar un estudiante
const updateEstudianteSchema = Joi.object({
  nombres,
  apellidos,
  fechaNacimiento,
  codigoInstitucional,
  activo
});

//Schema para obtener un estudiante por su id
const getEstudianteSchema = Joi.object({
  id: id.required(),
});

//Schema para obtener un numero de estudiantes definido
const queryEstudianteSchema = Joi.object({
  limit,
  offset,
});

export { createEstudianteSchema, updateEstudianteSchema, getEstudianteSchema, queryEstudianteSchema };
