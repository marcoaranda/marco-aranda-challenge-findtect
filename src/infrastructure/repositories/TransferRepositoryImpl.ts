import { Pool } from 'pg';
import { Transfer, TransferCreationParams } from '../../domain/entities/Transfer';
import { TransferRepository } from '../../domain/repositories/TransferRepository';

export class TransferRepositoryImpl implements TransferRepository {
  constructor(private pool: Pool) {}

  async create(transferData: TransferCreationParams): Promise<Transfer> {
    const transferDate = new Date();
    
    const query = `
      INSERT INTO transfers (amount, company_id, debit_account, credit_account, transfer_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, amount, company_id as "companyId", debit_account as "debitAccount", credit_account as "creditAccount", 
                transfer_date as "transferDate", created_at as "createdAt", updated_at as "updatedAt"
    `;

    const values = [
      transferData.amount,
      transferData.companyId,
      transferData.debitAccount,
      transferData.creditAccount,
      transferDate
    ];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getById(id: number): Promise<Transfer | null> {
    const query = `
      SELECT id, amount, company_id as "companyId", debit_account as "debitAccount", credit_account as "creditAccount", 
             transfer_date as "transferDate", created_at as "createdAt", updated_at as "updatedAt"
      FROM transfers
      WHERE id = $1
    `;

    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return result.rows[0];
  }

  async getByCompanyId(companyId: number): Promise<Transfer[]> {
    const query = `
      SELECT id, amount, company_id as "companyId", debit_account as "debitAccount", credit_account as "creditAccount", 
             transfer_date as "transferDate", created_at as "createdAt", updated_at as "updatedAt"
      FROM transfers
      WHERE company_id = $1
      ORDER BY transfer_date DESC
    `;

    const result = await this.pool.query(query, [companyId]);
    return result.rows;
  }

  async getLastMonthTransfers(): Promise<Transfer[]> {
    const query = `
      SELECT id, amount, company_id as "companyId", debit_account as "debitAccount", credit_account as "creditAccount", 
             transfer_date as "transferDate", created_at as "createdAt", updated_at as "updatedAt"
      FROM transfers
      WHERE transfer_date >= date_trunc('month', current_date - interval '1 month')
      AND transfer_date < date_trunc('month', current_date)
      ORDER BY transfer_date DESC
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }
} 