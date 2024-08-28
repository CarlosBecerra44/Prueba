const { Pool } = require('pg');

const pool = new Pool({
  user: 'sistemas',
  host: 'localhost',
  database: 'aionet',
  password: 'NutriAdmin2035',
  port: 5432, // Puerto por defecto de PostgreSQL
});

module.exports = pool;
