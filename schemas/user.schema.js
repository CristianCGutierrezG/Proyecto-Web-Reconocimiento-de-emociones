import Joi from 'joi'

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const validRoles = ['Estudiante', 'Profesor', 'Profesional de salud'];

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: Joi.string().valid(...validRoles).required()
});

const updateUserSchema = Joi.object({
  email: email,
  role: Joi.string().valid(...validRoles)
});

const getUserSchema = Joi.object({
  id: id.required(),
});

export { createUserSchema, updateUserSchema, getUserSchema };

