import { User, UserCreationParams } from '../entities/User';

export interface UserRepository {
  create(user: UserCreationParams): Promise<User>;
  getById(id: number): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
} 