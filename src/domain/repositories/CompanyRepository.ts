import { Company, CompanyCreationParams } from '../entities/Company';

export interface CompanyRepository {
  create(company: CompanyCreationParams): Promise<Company>;
  getById(id: number): Promise<Company | null>;
  getByCuit(cuit: string): Promise<Company | null>;
  getAdheredLastMonth(): Promise<Company[]>;
  getWithTransfersLastMonth(): Promise<Company[]>;
} 