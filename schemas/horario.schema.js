import Joi from 'joi'

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos de horarios
*/ 

const id = Joi.number().integer();
const dia = Joi.string();
// const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
// const horaInicio = Joi.string().regex(timeRegex);
// const horaFin = Joi.string().regex(timeRegex);
const horaInicio = Joi.date().iso();
const horaFin = Joi.date().iso();
const materiaId = Joi.number().integer();

//Schema para crear un horario con el id de una materia
const createHorariosSchema = Joi.object({
    dia: dia.required(),
    horaInicio: horaInicio.required(),
    horaFin: horaFin.required(),
    materiaId: materiaId.required()
});

//Schema para actualizar un horario
const updateHorariosSchema = Joi.object({
    dia,
    horaInicio,
    horaFin
});

//Schema para obtener un horario por su id
const getHorariosSchema = Joi.object({
  id: id.required(),
});

export { createHorariosSchema, updateHorariosSchema, getHorariosSchema };