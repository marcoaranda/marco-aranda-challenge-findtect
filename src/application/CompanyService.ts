import { Company, CompanyCreationParams } from '../domain/entities/Company';
import { CompanyRepository } from '../domain/repositories/CompanyRepository';

export class CompanyService {
  constructor(private companyRepository: CompanyRepository) {}

  async createCompany(companyData: CompanyCreationParams): Promise<Company> {
    const existingCompany = await this.companyRepository.getByCuit(companyData.cuit);
    
    if (existingCompany) {
      throw new Error('A company with this CUIT already exists');
    }
    
    return this.companyRepository.create({
      ...companyData
    });
  }

  async getCompaniesAdheredLastMonth(): Promise<Company[]> {
    return this.companyRepository.getAdheredLastMonth();
  }

  async getCompaniesWithTransfersLastMonth(): Promise<Company[]> {
    return this.companyRepository.getWithTransfersLastMonth();
  }
} 