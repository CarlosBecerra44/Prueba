const { Pool } = require('pg');

const pool = new Pool({
  user: 'aionnetx',
  host: 'aionnet.net',
  database: 'aionnetx_aionet',
  password: 'Mxxnatura2536//',
  port: 5432, 
  ssl: false, 

});

module.exports = pool;
