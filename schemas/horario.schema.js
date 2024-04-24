import Joi from 'joi'

const id = Joi.number().integer();
const dia = Joi.string();
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
const horaInicio = Joi.string().regex(timeRegex).required();
const horaFin = Joi.string().regex(timeRegex).required();
const materiaId = Joi.number().integer();

const createHorariosSchema = Joi.object({
    dia: dia.required(),
    horaInicio: horaInicio.required(),
    horaFin: horaFin.required(),
    materiaId: materiaId.required()
});

const updateHorariosSchema = Joi.object({
    dia,
    horaInicio,
    horaFin
});

const getHorariosSchema = Joi.object({
  id: id.required(),
});

export { createHorariosSchema, updateHorariosSchema, getHorariosSchema };