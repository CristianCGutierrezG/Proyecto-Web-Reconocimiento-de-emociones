import Joi from 'joi'

const id = Joi.number().integer();
const nombre = Joi.string();
const grupo = Joi.string();
// const horario = Joi.date();
const profesorId = Joi.number().integer();
const materiaId = Joi.number().integer();
const estudianteId = Joi.number().integer();
const limit = Joi.number().integer();
const offset = Joi.number().integer();


const createMateriasSchema = Joi.object({
  nombre: nombre.required(),
  grupo: grupo.required(),
  profesorId
  // horario: horario.required(),
});

const updateMateriasSchema = Joi.object({
  nombre,
  grupo,
  profesorId
  // horario
});

const getMateriasSchema = Joi.object({
  id: id.required(),
});

const addInscripcionSchema = Joi.object({
  materiaId: materiaId.required(),
  estudianteId
});

const queryMateriaSchema = Joi.object({
  limit,
  offset,
});


export { createMateriasSchema, updateMateriasSchema, getMateriasSchema, queryMateriaSchema,  addInscripcionSchema  };

