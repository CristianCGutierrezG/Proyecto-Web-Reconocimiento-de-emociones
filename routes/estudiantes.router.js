import express from 'express';

import {EstudiantesService} from '../services/estudiante.service.js'
import {validatorHandler} from '../middlewares/validator.handler.js'
import { createEstudianteSchema, updateEstudianteSchema, getEstudianteSchema } from '../schemas/estudiante.schema.js';

const router = express.Router();
const service = new EstudiantesService();

router.get('/', async (req, res, next) => {
  try {
    const estudiante = await service.find();
    res.json(estudiante);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const Estudiante = await service.findOne(id);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id/emociones',
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const Estudiante = await service.findOneByEmociones(id);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id/materias',
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const Estudiante = await service.findOneByMaterias(id);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createEstudianteSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newEstudiante = await service.create(body);
      res.status(201).json(newEstudiante);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getEstudianteSchema, 'params'),
  validatorHandler(updateEstudianteSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const Estudiante = await service.update(id, body);
      res.json(Estudiante);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

export {router};
