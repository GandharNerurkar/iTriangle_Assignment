import pkg from 'pg';
const { Pool } = pkg;

import { pg } from './env.js';

const pool = new Pool(pg);

pool.on('connect', () => {
  console.info('Database connected successfully');
});

pool.on('error', (error) => {
  console.error('Unexpected idle client error', error);
});

export async function query(text, params) {
  return pool.query(text, params);
}

export async function getClient() {
  return pool.connect();
}

export { pool };