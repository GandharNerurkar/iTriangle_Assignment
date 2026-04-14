const { Pool } = require('pg');
const { pg } = require('./env');

const pool = new Pool(pg);

pool.on('connect', () => {
  console.info('Database connected successfully');
});

pool.on('error', (error) => {
  console.error('Unexpected idle client error', error);
});

async function query(text, params) {
  return pool.query(text, params);
}

async function getClient() {
  return pool.connect();
}

module.exports = {
  query,
  getClient,
  pool,
};
