import request from 'supertest';
import app from '../src/server';
import { UserRole } from '../src/domain/entities/User';

describe('Auth Endpoints', () => {
  let authToken: string;

  beforeAll(async () => {
    try {
      await global.pool.query('DELETE FROM users WHERE email LIKE $1 OR username LIKE $1', ['test%']);
    } catch (error) {
      console.error('Error in beforeAll cleanup:', error);
    }
  });

  beforeEach(async () => {
    try {
      await global.pool.query('DELETE FROM users WHERE email LIKE $1 OR username LIKE $1', ['test%']);
    } catch (error) {
      console.error('Error in beforeEach cleanup:', error);
    }
  });

  afterAll(async () => {
    try {
      await global.pool.query('DELETE FROM users WHERE email LIKE $1 OR username LIKE $1', ['test%']);
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: UserRole.USER
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user).toHaveProperty('username', 'testuser');
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.data.user).not.toHaveProperty('password');
    });

    it('should not register a user with existing email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: UserRole.USER
        });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser2',
          email: 'test@example.com',
          password: 'password123',
          role: UserRole.USER
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('fail');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      try {
        await request(app)
          .post('/api/auth/register')
          .send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            role: UserRole.USER
          });
      } catch (error) {
        console.error('Error in login beforeEach:', error);
      }
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
      authToken = res.body.data.token;
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe('fail');
    });
  });
});