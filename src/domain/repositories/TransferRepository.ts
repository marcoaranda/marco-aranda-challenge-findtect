import { Transfer, TransferCreationParams } from '../entities/Transfer';

export interface TransferRepository {
  create(transfer: TransferCreationParams): Promise<Transfer>;
  getById(id: number): Promise<Transfer | null>;
  getByCompanyId(companyId: number): Promise<Transfer[]>;
  getLastMonthTransfers(): Promise<Transfer[]>;
} 