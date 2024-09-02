const { Pool } = require('pg');

const pool = new Pool({
  user: 'aionet_owner',
  host: 'ep-bitter-scene-a5wk1xt2.us-east-2.aws.neon.tech',
  database: 'aionet',
  password: 'rzUZtRVd2WD9',
  port: 5432, 
  ssl: {
    rejectUnauthorized: false, // Esto asegura que la conexión use SSL, pero sin verificar el certificado
  },// Puerto por defecto de PostgreSQL
});

module.exports = pool;
