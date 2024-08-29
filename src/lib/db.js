const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aionet',
  password: 'gus100202',
  port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;
