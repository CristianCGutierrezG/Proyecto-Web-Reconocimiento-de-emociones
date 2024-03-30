import express from 'express';

import { MateriasService } from '../services/materias.service.js'; 
import { validatorHandler } from './../middlewares/validator.handler.js';
import { updateMateriasSchema, createMateriasSchema, getMateriasSchema, addInscripcionSchema } from '../schemas/materias.schema.js'; 

const router = express.Router();
const service = new MateriasService();

router.get('/', async (req, res, next) => {
  try {
    const materias = await service.find();
    res.json(materias);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getMateriasSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const materias = await service.findOne(id);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createMateriasSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newMaterias = await service.create(body);
      res.status(201).json(newMaterias);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/add-inscripcion',
  validatorHandler(addInscripcionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newInscripcion = await service.addInscripcion(body);
      res.status(201).json(newInscripcion);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getMateriasSchema, 'params'),
  validatorHandler(updateMateriasSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const materias = await service.update(id, body);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getMateriasSchema, 'params'),
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

