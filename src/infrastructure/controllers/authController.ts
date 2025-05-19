import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/AuthService';
import { UserRole } from '../../domain/entities/User';
import { AppError } from '../middlewares/errorMiddleware';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        throw new AppError('Username, email and password are required', 400);
      }

      if (role && !Object.values(UserRole).includes(role as UserRole)) {
        throw new AppError('Invalid role', 400);
      }

      const user = await this.authService.register({
        username,
        email,
        password,
        role: role as UserRole
      });

      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        status: 'success',
        data: {
          user: userWithoutPassword
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === 'Username already exists' ||
          error.message === 'Email already exists'
        ) {
          return next(new AppError(error.message, 400));
        }
      }
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        throw new AppError('Username and password are required', 400);
      }

      const authResponse = await this.authService.login(username, password);

      res.status(200).json({
        status: 'success',
        data: authResponse
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return next(new AppError('Invalid username or password', 401));
      }
      next(error);
    }
  };
}