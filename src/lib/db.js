const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'aionet',
  password: 'gus100202',
  port: 5432, 
  /*ssl: {
    rejectUnauthorized: false, // Esto asegura que la conexión use SSL, pero sin verificar el certificado
  },// Puerto por defecto de PostgreSQL*/
});

module.exports = pool;
