import { Pool } from 'pg';
import { Company, CompanyCreationParams } from '../../domain/entities/Company';
import { CompanyRepository } from '../../domain/repositories/CompanyRepository';

export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private pool: Pool) {}

  async create(companyData: CompanyCreationParams): Promise<Company> {
    const adhesionDate = new Date();
    
    const query = `
      INSERT INTO companies (cuit, business_name, adhesion_date, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING id, cuit, business_name as "businessName", adhesion_date as "adhesionDate", created_at as "createdAt", updated_at as "updatedAt"
    `;

    const values = [companyData.cuit, companyData.businessName, adhesionDate];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getById(id: number): Promise<Company | null> {
    const query = `
      SELECT id, cuit, business_name as "businessName", adhesion_date as "adhesionDate", created_at as "createdAt", updated_at as "updatedAt"
      FROM companies
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async getByCuit(cuit: string): Promise<Company | null> {
    const query = `
      SELECT id, cuit, business_name as "businessName", adhesion_date as "adhesionDate", created_at as "createdAt", updated_at as "updatedAt"
      FROM companies
      WHERE cuit = $1
    `;

    const result = await this.pool.query(query, [cuit]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async getAdheredLastMonth(): Promise<Company[]> {
    const query = `
      SELECT id, cuit, business_name as "businessName", adhesion_date as "adhesionDate", created_at as "createdAt", updated_at as "updatedAt"
      FROM companies
      WHERE adhesion_date >= date_trunc('month', current_date - interval '1 month')
      AND adhesion_date < date_trunc('month', current_date)
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getWithTransfersLastMonth(): Promise<Company[]> {
    const query = `
      SELECT DISTINCT c.id, c.cuit, c.business_name as "businessName", c.adhesion_date as "adhesionDate", c.created_at as "createdAt", c.updated_at as "updatedAt"
      FROM companies c
      JOIN transfers t ON c.id = t.company_id
      WHERE t.transfer_date >= date_trunc('month', current_date - interval '1 month')
      AND t.transfer_date < date_trunc('month', current_date)
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }
} 