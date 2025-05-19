import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../../application/CompanyService';
import { AppError } from '../middlewares/errorMiddleware';

export class CompanyController {
  constructor(private companyService: CompanyService) {}

  adhereCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cuit, businessName } = req.body;

      if (!cuit || !businessName) {
        throw new AppError('CUIT and business name are required', 400);
      }

      const company = await this.companyService.createCompany({
        cuit,
        businessName
      });

      res.status(201).json({
        status: 'success',
        data: {
          company
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'A company with this CUIT already exists') {
        return next(new AppError(error.message, 400));
      }
      next(error);
    }
  };

  getCompaniesWithTransfersLastMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companies = await this.companyService.getCompaniesWithTransfersLastMonth();

      res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
          companies
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getCompaniesAdheredLastMonth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companies = await this.companyService.getCompaniesAdheredLastMonth();

      res.status(200).json({
        status: 'success',
        results: companies.length,
        data: {
          companies
        }
      });
    } catch (error) {
      next(error);
    }
  };
}