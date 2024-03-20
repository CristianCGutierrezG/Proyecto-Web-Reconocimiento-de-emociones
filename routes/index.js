import express from 'express';

import {router as productsRouter} from './products.router.js';
import {router as usersRouter} from './users.router.js';

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/products', productsRouter);
  router.use('/users', usersRouter);
}

export {routerApi};
