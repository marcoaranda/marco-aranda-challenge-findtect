import { Pool } from 'pg';
import dotenv from 'dotenv';
import app from '../src/server';
import { getPool, closePool } from '../src/infrastructure/config/database';

dotenv.config();

declare global {
  var pool: Pool;
}

let server: any;

beforeAll(async () => {
  global.pool = getPool();
  server = app.listen(0);
});

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  }

  try {
    await global.pool.query('DELETE FROM companies WHERE cuit LIKE $1', ['test%']);
    await global.pool.query('DELETE FROM users WHERE email LIKE $1 OR username LIKE $1', ['test%']);
  } catch (error) {
    console.error('Error in cleanup:', error);
  }

  await closePool();
}); 