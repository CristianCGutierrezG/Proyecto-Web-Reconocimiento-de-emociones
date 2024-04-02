import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { MateriasService } from '../services/materias.service.js'; 
import { validatorHandler } from './../middlewares/validator.handler.js';
import { updateMateriasSchema, createMateriasSchema, getMateriasSchema, queryMateriaSchema, addInscripcionSchema } from '../schemas/materias.schema.js'; 

const router = express.Router();
const service = new MateriasService();

router.get('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(queryMateriaSchema, 'params'),
  async (req, res, next) => {
    try {
      const materia = await service.find(req.query);
      res.status(200).json(materia);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Profesor', 'Profesional de salud', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(createMateriasSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user
      const newMaterias = await service.create(body, user.sub);
      res.status(201).json(newMaterias);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/add-inscripcion',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante', 'Profesor', 'Administrador'),
  validatorHandler(addInscripcionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user
      const newInscripcion = await service.addInscripcion(body, user.sub);
      res.status(201).json(newInscripcion);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
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
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
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

