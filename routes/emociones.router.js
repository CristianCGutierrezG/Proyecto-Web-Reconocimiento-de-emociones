import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { EmocionService } from '../services/emocion.service.js';
import { validatorHandler } from './../middlewares/validator.handler.js';
import { updateEmocionSchema, createEmocionSchema, getEmocionSchema } from '../schemas/emociones.schema.js'; 

const router = express.Router();
const service = new EmocionService();

router.get('/', 
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Profesional de salud', 'Administrador'),
  async (req, res, next) => {
    try {
      const emocion = await service.find();
      res.json(emocion);
    } catch (error) {
      next(error);
    }
});

router.get('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Estudiante','Profesor', 'Profesional de salud', 'Administrador'),
  validatorHandler(getEmocionSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const emocion = await service.findOne(id);
      res.json(emocion);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', {session: false}),
  validatorHandler(createEmocionSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = req.user
      const newEmocion = await service.create(body, user.sub);
      res.status(201).json(newEmocion);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getEmocionSchema, 'params'),
  validatorHandler(updateEmocionSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const emocion = await service.update(id, body);
      res.json(emocion);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
passport.authenticate('jwt', {session: false}),
  checkRoles('Administrador'),
  validatorHandler(getEmocionSchema, 'params'),
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

