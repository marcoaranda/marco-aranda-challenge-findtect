import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({
      host: process.env.DB_HOST || '172.25.51.225',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '282828',
      database: process.env.DB_NAME || 'findtect_db',
    });

    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.error('Error connecting to the database', err.stack);
      } else {
        console.log('Database connected successfully');
      }
    });
  }
  return pool;
};

export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
  }
};

export default getPool;