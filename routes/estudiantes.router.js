import express from 'express';

import {EstudiantesService} from '../services/estudiante.service.js'
import {validatorHandler} from '../middlewares/validator.handler.js'
import { createEstudianteSchema, updateEstudianteSchema, getEstudianteSchema, queryEstudianteSchema } from '../schemas/estudiante.schema.js';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';


const router = express.Router();
const service = new EstudiantesService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(queryEstudianteSchema, 'params'),
  async (req, res, next) => {
    try {
      const estudiante = await service.find(req.query);
      res.status(200).json(estudiante);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'),
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
passport.authenticate('jwt', {session: false}),
checkRoles('Estudiante', 'Profesional de salud', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Administrador'),
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
