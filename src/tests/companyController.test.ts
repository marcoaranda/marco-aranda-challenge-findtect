import { Request, Response } from 'express';
import { CompanyController } from '../infrastructure/controllers/companyController';
import { CompanyService } from '../application/CompanyService';
import { Company } from '../domain/entities/Company';
import { AppError } from '../infrastructure/middlewares/errorMiddleware';

// Service mock
const mockCompanyService = {
  createCompany: jest.fn(),
  getCompaniesAdheredLastMonth: jest.fn(),
  getCompaniesWithTransfersLastMonth: jest.fn()
} as unknown as jest.Mocked<CompanyService>;

// Request and response mocks
const mockRequest = () => {
  const req = {} as Request;
  req.body = {};
  return req;
};

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res;
};

const mockNext = jest.fn();

describe('CompanyController', () => {
  let companyController: CompanyController;
  
  beforeEach(() => {
    jest.clearAllMocks();
    companyController = new CompanyController(mockCompanyService);
  });
  
  describe('adhereCompany', () => {
    it('should create a company successfully', async () => {
      const req = mockRequest();
      req.body = {
        cuit: '30-12345678-0',
        businessName: 'Test Company'
      };
      
      const res = mockResponse();
      
      const createdCompany: Company = {
        id: 1,
        cuit: '30-12345678-0',
        businessName: 'Test Company',
        adhesionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockCompanyService.createCompany.mockResolvedValue(createdCompany);
      
      await companyController.adhereCompany(req, res, mockNext);
      
      expect(mockCompanyService.createCompany).toHaveBeenCalledWith({
        cuit: '30-12345678-0',
        businessName: 'Test Company'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          company: createdCompany
        }
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    it('should call next with error if CUIT is missing', async () => {
      const req = mockRequest();
      req.body = {
        businessName: 'Test Company'
      };
      
      const res = mockResponse();
      
      await companyController.adhereCompany(req, res, mockNext);
      
      expect(mockCompanyService.createCompany).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('CUIT and business name are required');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
    
    it('should call next with error if company with CUIT already exists', async () => {
      const req = mockRequest();
      req.body = {
        cuit: '30-12345678-0',
        businessName: 'Test Company'
      };
      
      const res = mockResponse();
      
      mockCompanyService.createCompany.mockRejectedValue(new Error('A company with this CUIT already exists'));
      
      await companyController.adhereCompany(req, res, mockNext);
      
      expect(mockCompanyService.createCompany).toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      expect(mockNext.mock.calls[0][0].message).toBe('A company with this CUIT already exists');
      expect(mockNext.mock.calls[0][0].statusCode).toBe(400);
    });
  });
  
  describe('getCompaniesAdheredLastMonth', () => {
    it('should return companies adhered last month', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      const companies: Company[] = [
        {
          id: 1,
          cuit: '30-12345678-0',
          businessName: 'Company 1',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockCompanyService.getCompaniesAdheredLastMonth.mockResolvedValue(companies);
      
      await companyController.getCompaniesAdheredLastMonth(req, res, mockNext);
      
      expect(mockCompanyService.getCompaniesAdheredLastMonth).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: companies.length,
        data: {
          companies
        }
      });
    });
  });
  
  describe('getCompaniesWithTransfersLastMonth', () => {
    it('should return companies with transfers last month', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      const companies: Company[] = [
        {
          id: 1,
          cuit: '30-12345678-0',
          businessName: 'Company 1',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockCompanyService.getCompaniesWithTransfersLastMonth.mockResolvedValue(companies);
      
      await companyController.getCompaniesWithTransfersLastMonth(req, res, mockNext);
      
      expect(mockCompanyService.getCompaniesWithTransfersLastMonth).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: companies.length,
        data: {
          companies
        }
      });
    });
  });
});