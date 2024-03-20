import pg from "pg";
const { Pool } = pg;

import { config } from "../config/config.js";
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

const pool = new Pool({connectionString: URL});


export {pool}