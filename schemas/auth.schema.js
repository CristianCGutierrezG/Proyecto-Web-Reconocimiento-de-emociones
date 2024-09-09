import Joi from 'joi';

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos de auth (autenticacion)
*/ 

const email = Joi.string().email();
const password = Joi.string().min(8);
const newPassword = Joi.string().min(8);
const token = Joi.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/);
const id = Joi.number().integer();

//Schema para el inicio de sesion de un usuario
const loginAuthSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

const recoverTokenSchema = Joi.object({
  id: id.required(),
});

//Schema para envio de link para recuperar contraseña
const recoveryAuthSchema = Joi.object({
  email: email.required(),
});

//Schema para realizar el cambio de contraseña
const changePasswordAuthSchema = Joi.object({
  token: token.required(),
  newPassword: newPassword.required(),
});

export { loginAuthSchema, recoverTokenSchema, recoveryAuthSchema, changePasswordAuthSchema };