import express from 'express';
import passport from 'passport';

import {EmocionService} from '../services/emocion.service.js';
import { MateriasService } from '../services/materias.service.js';
import { EstudiantesService } from '../services/estudiante.service.js'; 

const router = express.Router();
const serviceEmocion = new EmocionService();
const serviceMaterias = new MateriasService();
const serviceEstudiante = new EstudiantesService();


//Mirar lo del tiempo del token, duracion del token

//Encuetra las emociones del estudiante segun el token de acceso
//la info relacionada con su cuenta
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

//Encuetra las materias inscritas del estudiante segun el token de acceso
//la info relacionada con su cuenta
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

//Encuetra la informacion personal del estudiante segun el token de acceso
//la info relacionada con su cuenta
router.get(
  '/estudiante-info',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const info = await serviceEstudiante.findByUser(user.sub);
      res.json(info);
    } catch (error) {
      next(error);
    }
  }
);

//Encuetra las materias del profesor segun el token de acceso
//la info relacionada con su cuenta
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