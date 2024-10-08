import Joi from 'joi'
import {createHorariosSchema}  from './horario.schema.js';

/** 
 * Define los diferentes schemas con los tipos de datos permitidos
 * para la validacion de datos de materias
*/ 

const id = Joi.number().integer();
const nombre = Joi.string();
const grupo = Joi.string();
const profesorId = Joi.number().integer();
const materiaId = Joi.number().integer();
const estudianteId = Joi.number().integer();
const activo = Joi.boolean();
const limit = Joi.number().integer();
const offset = Joi.number().integer();
const horarios = Joi.array().items(createHorariosSchema).min(1);

//Schema para crear una materia con el id de un profesor
const createMateriasSchema = Joi.object({
  nombre: nombre.required(),
  grupo: grupo.required(),
  profesorId: profesorId.required(),
  horarios: horarios
});

//Schema para actualizar una materia
const updateMateriasSchema = Joi.object({
  nombre,
  grupo,
  profesorId,
  activo, 
  horarios
});

//Schema para obtener una materia por su id
const getMateriasSchema = Joi.object({
  id: id.required(),
});

//Schema para relacionar un estudiante con una materia
const addInscripcionSchema = Joi.object({
  materiaId: materiaId.required(),
  estudianteId
});

//Schema para obtener un numero de materias definido
const queryMateriaSchema = Joi.object({
  limit,
  offset,
});


export { createMateriasSchema, updateMateriasSchema, getMateriasSchema, queryMateriaSchema,  addInscripcionSchema };

