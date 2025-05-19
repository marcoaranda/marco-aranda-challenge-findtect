import { CompanyRepositoryImpl } from '../infrastructure/repositories/CompanyRepositoryImpl';
import { Company, CompanyCreationParams } from '../domain/entities/Company';
import { Pool } from 'pg';

// Mock with any type to avoid typing issues
const mockPool = {
  query: jest.fn()
} as any;

describe('CompanyRepositoryImpl', () => {
  let companyRepository: CompanyRepositoryImpl;
  
  beforeEach(() => {
    jest.clearAllMocks();
    companyRepository = new CompanyRepositoryImpl(mockPool);
  });
  
  describe('create', () => {
    it('should create a company successfully', async () => {
      const companyData: CompanyCreationParams = {
        cuit: '30-12345678-0',
        businessName: 'Test Company'
      };
      
      const expectedCreatedCompany = {
        id: 1,
        cuit: '30-12345678-0',
        businessName: 'Test Company',
        adhesionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPool.query.mockResolvedValue({
        rows: [expectedCreatedCompany]
      });
      
      const result = await companyRepository.create(companyData);
      
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO companies'),
        expect.arrayContaining([companyData.cuit, companyData.businessName])
      );
      expect(result).toEqual(expectedCreatedCompany);
    });
  });
  
  describe('getByCuit', () => {
    it('should return a company when found by CUIT', async () => {
      const cuit = '30-12345678-0';
      
      const expectedCompany = {
        id: 1,
        cuit: '30-12345678-0',
        businessName: 'Test Company',
        adhesionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockPool.query.mockResolvedValue({
        rows: [expectedCompany]
      });
      
      const result = await companyRepository.getByCuit(cuit);
      
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [cuit]
      );
      expect(result).toEqual(expectedCompany);
    });
    
    it('should return null when company not found by CUIT', async () => {
      const cuit = '30-12345678-0';
      
      mockPool.query.mockResolvedValue({
        rows: []
      });
      
      const result = await companyRepository.getByCuit(cuit);
      
      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        [cuit]
      );
      expect(result).toBeNull();
    });
  });
  
  describe('getAdheredLastMonth', () => {
    it('should return companies adhered last month', async () => {
      const companies = [
        {
          id: 1,
          cuit: '30-12345678-0',
          businessName: 'Company 1',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          cuit: '30-23456789-1',
          businessName: 'Company 2',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockPool.query.mockResolvedValue({
        rows: companies
      });
      
      const result = await companyRepository.getAdheredLastMonth();
      
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('WHERE adhesion_date >='));
      expect(result).toEqual(companies);
    });
  });
  
  describe('getWithTransfersLastMonth', () => {
    it('should return companies with transfers last month', async () => {
      const companies = [
        {
          id: 1,
          cuit: '30-12345678-0',
          businessName: 'Company 1',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockPool.query.mockResolvedValue({
        rows: companies
      });
      
      const result = await companyRepository.getWithTransfersLastMonth();
      
      expect(mockPool.query).toHaveBeenCalledWith(expect.stringContaining('JOIN transfers'));
      expect(result).toEqual(companies);
    });
  });
}); 