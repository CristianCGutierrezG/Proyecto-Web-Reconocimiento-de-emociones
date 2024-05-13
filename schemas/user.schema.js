import Joi from 'joi'

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos del usuario
*/ 
const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const validRoles = ['Administrador'];
const activo = Joi.boolean();
const limit = Joi.number().integer();
const offset = Joi.number().integer();

//Schema para crear un usuario 
const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: Joi.string().valid(...validRoles).required()
});

//Schema para actualizar un usuario 
const updateUserSchema = Joi.object({
  email: email,
  role: Joi.string().valid(...validRoles),
  activo
});

//Schema para obtener un usuario por su id
const getUserSchema = Joi.object({
  id: id.required(),
});

//Schema para obtener un numero de usuarios definido
const queryUserSchema = Joi.object({
  limit,
  offset,
});

export { createUserSchema, updateUserSchema, getUserSchema, queryUserSchema };




