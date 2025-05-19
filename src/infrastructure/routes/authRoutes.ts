import express from 'express';
import { AuthController } from '../controllers/authController';
import { AuthService } from '../../application/AuthService';
import { UserRepositoryImpl } from '../repositories/UserRepositoryImpl';
import { getPool } from '../config/database';

const router = express.Router();

// Initialize repositories and services
const userRepository = new UserRepositoryImpl(getPool());
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

export default router; 