import express from 'express';

import {ProSaludService} from '../services/proSalud.service.js'
import {validatorHandler} from '../middlewares/validator.handler.js'
import { createProSaludSchema, updateProSaludSchema, getProSaludSchema } from '../schemas/proSalud.schema.js';

const router = express.Router();
const service = new ProSaludService();

router.get('/', async (req, res, next) => {
  try {
    const proSalud = await service.find();
    res.json(proSalud);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getProSaludSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const proSalud = await service.findOne(id);
      res.json(proSalud);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createProSaludSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProSalud = await service.create(body);
      res.status(201).json(newProSalud);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getProSaludSchema, 'params'),
  validatorHandler(updateProSaludSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const proSalud = await service.update(id, body);
      res.json(proSalud);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getProSaludSchema, 'params'),
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
