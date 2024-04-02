import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { ProfesoresService } from '../services/profesor.service.js';
import {validatorHandler} from '../middlewares/validator.handler.js'
import { createProfesorSchema, updateProfesorSchema, getProfesorSchema, queryProfesorSchema } from '../schemas/profesor.schema.js';

const router = express.Router();
const service = new ProfesoresService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(queryProfesorSchema, 'params'),
  async (req, res, next) => {
    try {
      const profesor = await service.find(req.query);
      res.status(200).json(profesor);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
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
