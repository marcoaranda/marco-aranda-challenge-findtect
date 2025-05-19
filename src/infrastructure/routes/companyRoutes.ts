import express from 'express';
import { CompanyController } from '../controllers/companyController';
import { CompanyService } from '../../application/CompanyService';
import { CompanyRepositoryImpl } from '../repositories/CompanyRepositoryImpl';
import { getPool } from '../config/database';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Initialize repositories and services
const companyRepository = new CompanyRepositoryImpl(getPool());
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

// Routes with authentication middleware
router.post('/adhere', authenticate, companyController.adhereCompany);
router.get('/with-transfers-last-month', authenticate, companyController.getCompaniesWithTransfersLastMonth);
router.get('/adhered-last-month', authenticate, companyController.getCompaniesAdheredLastMonth);

export default router; 