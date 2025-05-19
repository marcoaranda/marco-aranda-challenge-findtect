import request from 'supertest';
import app from '../src/server';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { UserRole } from '../src/domain/entities/User';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

describe('Company Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    await pool.query('DELETE FROM companies WHERE cuit LIKE $1', ['test%']);
    await pool.query('DELETE FROM users WHERE email LIKE $1 OR username LIKE $1', ['test%']);
    
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER
      });

    expect(registerRes.status).toBe(201);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data).toHaveProperty('token');
    authToken = loginRes.body.data.token;
  });

  beforeEach(async () => {
    await pool.query('DELETE FROM companies WHERE cuit LIKE $1', ['test%']);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/companies/adhere', () => {
    it('should create a new company', async () => {
      const res = await request(app)
        .post('/api/companies/adhere')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cuit: 'test12345678',
          businessName: 'Test Company'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.company).toHaveProperty('cuit', 'test12345678');
      expect(res.body.data.company).toHaveProperty('businessName', 'Test Company');
    });

    it('should not create a company with existing CUIT', async () => {
      await request(app)
        .post('/api/companies/adhere')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cuit: 'test12345678',
          businessName: 'Test Company'
        });

      const res = await request(app)
        .post('/api/companies/adhere')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          cuit: 'test12345678',
          businessName: 'Another Test Company'
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('GET /api/companies/with-transfers-last-month', () => {
    it('should get companies with transfers last month', async () => {
      const res = await request(app)
        .get('/api/companies/with-transfers-last-month')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.companies)).toBe(true);
    });
  });

  describe('GET /api/companies/adhered-last-month', () => {
    it('should get companies adhered last month', async () => {
      const res = await request(app)
        .get('/api/companies/adhered-last-month')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.companies)).toBe(true);
    });
  });
});