import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

describe('Database Tests', () => {
  afterAll(async () => {
    await pool.end();
  });

  it('should connect to database and execute a query', async () => {
    const result = await pool.query('SELECT NOW()');
    expect(result.rows).toBeDefined();
    expect(result.rows.length).toBeGreaterThan(0);
  });
}); 