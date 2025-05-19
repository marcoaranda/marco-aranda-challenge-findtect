export interface Transfer {
  id?: number;
  amount: number;
  companyId: number;
  debitAccount: string;
  creditAccount: string;
  transferDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransferCreationParams {
  amount: number;
  companyId: number;
  debitAccount: string;
  creditAccount: string;
} 