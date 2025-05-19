import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, UserCreationParams, UserRole } from '../domain/entities/User';
import { UserRepository } from '../domain/repositories/UserRepository';

interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(userData: UserCreationParams): Promise<User> {
    const existingUserByUsername = await this.userRepository.getByUsername(userData.username);
    const existingUserByEmail = await this.userRepository.getByEmail(userData.email);
    
    if (existingUserByUsername) {
      throw new Error('Username already exists');
    }
    
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    return this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.USER
    });
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.getByUsername(username);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword
    };
  }

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    const payload = { 
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    return jwt.sign(
      payload, 
      'findtect_secret_key_very_secure', 
      { expiresIn: '24h' }
    );
  }
}