import express from 'express';

import {router as usersRouter} from './users.router.js';
import {router as estudiantesRouter} from './estudiantes.router.js';
import {router as profesoresRouter} from './profesores.router.js'; 
import {router as emocionRouter}  from './emociones.router.js';
import {router as proSaludRouter} from './proSalud.router.js';
import {router as materiasRouter} from './materias.router.js'; 
import {router as horariosRouter} from './horarios.router.js'; 
import {router as authRouter} from './auth.router.js'; 
import {router as profileRouter} from './profile.router.js'; 

function routerApi(app) {
  const router = express.Router();
  
  app.use('/api/v1', router);

  router.use('/users', usersRouter);
  router.use('/estudiantes', estudiantesRouter);
  router.use('/profesores', profesoresRouter);
  router.use('/proSalud', proSaludRouter);
  router.use('/emociones', emocionRouter);
  router.use('/materias', materiasRouter);
  router.use('/horarios', horariosRouter);
  router.use('/auth', authRouter);
  router.use('/profile', profileRouter);
}

export {routerApi};
