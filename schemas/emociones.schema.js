import Joi from 'joi'

const id = Joi.number().integer();
const validEmociones = ['Feliz', 'Triste', 'Furioso', 'Enojado'];
const estudianteId = Joi.number().integer();

const createEmocionSchema = Joi.object({
  emocion: Joi.string().valid(...validEmociones).required(),
  estudianteId
});

const updateEmocionSchema = Joi.object({
  emocion: Joi.string().valid(...validEmociones),
  estudianteId
});

const getEmocionSchema = Joi.object({
  id: id.required(),
});

export { createEmocionSchema, updateEmocionSchema, getEmocionSchema };
