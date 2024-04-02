import express from 'express';
import passport from 'passport';

import {EmocionService} from '../services/emocion.service.js';
import { MateriasService } from '../services/materias.service.js';

const router = express.Router();
const serviceEmocion = new EmocionService();
const serviceMaterias = new MateriasService();

router.get(
  '/estudiante-emociones',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const emociones = await serviceEmocion.findByUser(user.sub);
      res.json(emociones);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/estudiante-materias',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const materias = await serviceMaterias.findByEstudiante(user.sub);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/profesor-materias',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const materias = await serviceMaterias.findByProfesor(user.sub);
      res.json(materias);
    } catch (error) {
      next(error);
    }
  }
);



export {router};