import express from 'express';

import {UserService} from './../services/user.service.js';
import {validatorHandler} from './../middlewares/validator.handler.js';
import { updateUserSchema, createUserSchema, getUserSchema } from './../schemas/user.schema.js';

const router = express.Router();
const service = new UserService();

router.get('/', async (req, res, next) => {
  try {
    const usuario = await service.find();
    res.json(usuario);
  } catch (error) {
    next(error);
  }
});

router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const usuario = await service.findOne(id);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUsuario = await service.create(body);
      res.status(201).json(newUsuario);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const usuario = await service.update(id, body);
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
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

