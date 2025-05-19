import { getPool } from '../config/database';

const createTables = async () => {
  const pool = getPool();
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        cuit VARCHAR(20) UNIQUE NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        adhesion_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS transfers (
        id SERIAL PRIMARY KEY,
        amount DECIMAL(12, 2) NOT NULL,
        company_id INTEGER NOT NULL,
        debit_account VARCHAR(100) NOT NULL,
        credit_account VARCHAR(100) NOT NULL,
        transfer_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        FOREIGN KEY (company_id) REFERENCES companies(id)
      )
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const dropTables = async () => {
  const pool = getPool();
  try {
    await pool.query('DROP TABLE IF EXISTS transfers');
    await pool.query('DROP TABLE IF EXISTS companies');
    await pool.query('DROP TABLE IF EXISTS users');

    console.log('Tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

const migrate = async () => {
  const pool = getPool();
  try {
    await createTables();
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
};

const rollback = async () => {
  const pool = getPool();
  try {
    await dropTables();
    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
  } finally {
    await pool.end();
  }
};

const action = process.argv[2];
if (action === 'rollback') {
  rollback();
} else {
  migrate();
}