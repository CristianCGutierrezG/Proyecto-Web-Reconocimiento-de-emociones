import express from 'express';

import { ProfesoresService } from '../services/profesor.service.js';
import {validatorHandler} from '../middlewares/validator.handler.js'
import { createProfesorSchema, updateProfesorSchema, getProfesorSchema } from '../schemas/profesor.schema.js';

const router = express.Router();
const service = new ProfesoresService();

router.get('/', async (req, res, next) => {
  try {
    const profesor = await service.find();
    res.json(profesor);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getProfesorSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const profesor = await service.findOne(id);
      res.json(profesor);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createProfesorSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProfesor = await service.create(body);
      res.status(201).json(newProfesor);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getProfesorSchema, 'params'),
  validatorHandler(updateProfesorSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const profesor = await service.update(id, body);
      res.json(profesor);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getProfesorSchema, 'params'),
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
