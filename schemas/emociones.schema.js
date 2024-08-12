import Joi from 'joi'

/**
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos de las emociones
*/

const id = Joi.number().integer();
const validEmociones = ['Enojado', 'Disgustado', 'Miedoso', 'Feliz', "Triste", "Sorprendido", "Neutral"];
const estudianteId = Joi.number().integer();

//Schema para crear una emoción
const createEmocionSchema = Joi.object({
  emocion: Joi.string().valid(...validEmociones).required()
});

export { createEmocionSchema };
