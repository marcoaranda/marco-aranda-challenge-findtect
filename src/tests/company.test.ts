import { CompanyService } from '../application/CompanyService';
import { Company, CompanyCreationParams } from '../domain/entities/Company';
import { CompanyRepository } from '../domain/repositories/CompanyRepository';

const mockCompanyRepository: jest.Mocked<CompanyRepository> = {
  create: jest.fn(),
  getById: jest.fn(),
  getByCuit: jest.fn(),
  getAdheredLastMonth: jest.fn(),
  getWithTransfersLastMonth: jest.fn()
};

describe('CompanyService', () => {
  let companyService: CompanyService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    companyService = new CompanyService(mockCompanyRepository);
  });
  
  describe('createCompany', () => {
    it('should create a company successfully', async () => {
      const companyData: CompanyCreationParams = {
        cuit: '30-12345678-0',
        businessName: 'Test Company'
      };
      
      const expectedCreatedCompany: Company = {
        id: 1,
        cuit: '30-12345678-0',
        businessName: 'Test Company',
        adhesionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockCompanyRepository.getByCuit.mockResolvedValue(null);
      mockCompanyRepository.create.mockResolvedValue(expectedCreatedCompany);
      
      const result = await companyService.createCompany(companyData);
      
      expect(mockCompanyRepository.getByCuit).toHaveBeenCalledWith(companyData.cuit);
      expect(mockCompanyRepository.create).toHaveBeenCalledWith(companyData);
      expect(result).toEqual(expectedCreatedCompany);
    });
    
    it('should throw an error if company with CUIT already exists', async () => {
      const companyData: CompanyCreationParams = {
        cuit: '30-12345678-0',
        businessName: 'Test Company'
      };
      
      const existingCompany: Company = {
        id: 1,
        cuit: '30-12345678-0',
        businessName: 'Existing Company',
        adhesionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockCompanyRepository.getByCuit.mockResolvedValue(existingCompany);
      
      await expect(companyService.createCompany(companyData))
        .rejects
        .toThrow('A company with this CUIT already exists');
        
      expect(mockCompanyRepository.getByCuit).toHaveBeenCalledWith(companyData.cuit);
      expect(mockCompanyRepository.create).not.toHaveBeenCalled();
    });
  });
  
  describe('getCompaniesAdheredLastMonth', () => {
    it('should return companies adhered last month', async () => {
      const expectedCompanies: Company[] = [
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
      
      mockCompanyRepository.getAdheredLastMonth.mockResolvedValue(expectedCompanies);
      
      const result = await companyService.getCompaniesAdheredLastMonth();
      
      expect(mockCompanyRepository.getAdheredLastMonth).toHaveBeenCalled();
      expect(result).toEqual(expectedCompanies);
    });
  });
  
  describe('getCompaniesWithTransfersLastMonth', () => {
    it('should return companies with transfers last month', async () => {
      const expectedCompanies: Company[] = [
        {
          id: 1,
          cuit: '30-12345678-0',
          businessName: 'Company 1',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          cuit: '30-34567890-2',
          businessName: 'Company 3',
          adhesionDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      mockCompanyRepository.getWithTransfersLastMonth.mockResolvedValue(expectedCompanies);
      
      const result = await companyService.getCompaniesWithTransfersLastMonth();
      
      expect(mockCompanyRepository.getWithTransfersLastMonth).toHaveBeenCalled();
      expect(result).toEqual(expectedCompanies);
    });
  });
}); 