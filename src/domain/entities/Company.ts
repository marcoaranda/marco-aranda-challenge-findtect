export interface Company {
  id?: number;
  cuit: string;
  businessName: string;
  adhesionDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyCreationParams {
  cuit: string;
  businessName: string;
} 