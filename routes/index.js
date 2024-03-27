import express from 'express';

import {router as estudiantesRouter} from './estudiantes.router.js';
import {router as usersRouter} from './users.router.js';
import {router as profesoresRouter} from './profesores.router.js' 
import {router as proSaludRouter} from './proSalud.router.js' 

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/users', usersRouter);
  router.use('/estudiantes', estudiantesRouter);
  router.use('/profesores', profesoresRouter);
  router.use('/proSalud', proSaludRouter);
}

export {routerApi};
