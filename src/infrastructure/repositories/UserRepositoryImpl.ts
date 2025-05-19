import { Pool } from 'pg';
import { User, UserCreationParams, UserRole } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class UserRepositoryImpl implements UserRepository {
  constructor(private pool: Pool) {}

  async create(userData: UserCreationParams): Promise<User> {
    const query = `
      INSERT INTO users (username, email, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, username, email, password, role, created_at as "createdAt", updated_at as "updatedAt"
    `;

    const values = [
      userData.username,
      userData.email,
      userData.password,
      userData.role || UserRole.USER
    ];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getById(id: number): Promise<User | null> {
    const query = `
      SELECT id, username, email, password, role, created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async getByUsername(username: string): Promise<User | null> {
    const query = `
      SELECT id, username, email, password, role, created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE username = $1
    `;

    const result = await this.pool.query(query, [username]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async getByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, username, email, password, role, created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE email = $1
    `;

    const result = await this.pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }
} 