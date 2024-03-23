import { SequelizeStorage, Umzug } from 'umzug';
import path from 'path';
import {sequelize} from '../libs/sequelize.js';

export const umzug = new Umzug({
  create: { folder: path.resolve('database', 'migrations') },
  migrations: { glob: path.resolve('database', 'migrations', '*.js') }, 
  context: sequelize.getQueryInterface(),
  logger: console,
  storage: new SequelizeStorage({ sequelize }),
});


if (import.meta.url === new URL(import.meta.url).href) {
  umzug.runAsCLI();
}

