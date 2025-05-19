import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../../domain/entities/User';
import { AppError } from './errorMiddleware';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new AppError('Authentication required', 401));
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    const secret = process.env.JWT_SECRET || 'default_secret';
    const decodedToken = jwt.verify(token, 'findtect_secret_key_very_secure') as {
      id: number;
      username: string;
      email: string;
      role: UserRole;
    };
    
    req.user = {
      id: decodedToken.id,
      username: decodedToken.username,
      email: decodedToken.email,
      role: decodedToken.role
    };
    
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError('Authentication required', 401));
      return;
    }
    
    if (!roles.includes(req.user.role)) {
      next(new AppError('Forbidden: Insufficient permissions', 403));
      return;
    }
    
    next();
  };
}; 