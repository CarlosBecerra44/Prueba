const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aionet',
  password: 'gus100202',
  port: 5432, 
  ssl: false, 

});

module.exports = pool;
