import pg from 'pg'

const getConnection = async () => {
  const client = new pg.Client({
    host: 'localhost',
    port: 56755,
    user: 'cris',
    password: 'Emociones_DevDB_CRIS',
    database: 'Emociones_DB',
  });
  await client.connect();
  return client;
};

export {getConnection}