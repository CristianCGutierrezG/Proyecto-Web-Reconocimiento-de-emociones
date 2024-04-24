import express from 'express';
import cors from 'cors';
import { checkApiKey } from './middlewares/auth.handler.js'  
import { routerApi } from './routes/index.js';
import { logErrors, ormErrorHandler, errorHandler, boomErrorHandler} from './middlewares/error.handler.js';

import passport from 'passport';
import { LocalStrategy } from './utils/auth/strategies/local.strategy.js';
import { JwtStrategy } from './utils/auth/strategies/jwt.strategy.js';

import { swaggerDocs } from './utils/doc/swagger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//Brinda acceso y permiso de cors a las rutas especificadas en la whitelist
const whitelist = [`http://localhost:${port}/api/v1/docs/`, `http://localhost:${port}`];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'));
    }
  }
}
app.use(cors(options));

passport.use(LocalStrategy);
passport.use(JwtStrategy);

app.get('/', (req, res) => {
  res.send('Hola mi server en express');
});

app.get('/nueva-ruta',checkApiKey, (req, res) => {
  res.send('Hola mi server en express');
});

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);



app.listen(port, () => {
  console.log('Mi port' +  port);
  swaggerDocs(app, port);
});