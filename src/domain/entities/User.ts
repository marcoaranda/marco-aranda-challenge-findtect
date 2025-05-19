export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface UserCreationParams {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
} 