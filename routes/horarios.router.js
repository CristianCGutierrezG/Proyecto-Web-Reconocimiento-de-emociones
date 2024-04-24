import express from 'express';
import passport from 'passport';
import { checkRoles } from '../middlewares/auth.handler.js';

import { HorariosService } from '../services/horarios.service.js'; 
import { validatorHandler } from './../middlewares/validator.handler.js';
import { createHorariosSchema, updateHorariosSchema, getHorariosSchema  } from '../schemas/horario.schema.js'; 

const router = express.Router();
const service = new HorariosService();

router.post('/',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(createHorariosSchema, 'body'),
  async (req, res, next) => {
    try {
        const body = req.body;
        const newHorario = await service.create(body);
        res.status(201).json(newHorario);
    } catch (error) {
        next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getHorariosSchema, 'params'),
  validatorHandler(updateHorariosSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const horarios = await service.update(id, body);
      res.json(horarios);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', {session: false}),
  checkRoles('Profesor', 'Administrador'),
  validatorHandler(getHorariosSchema, 'params'),
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

