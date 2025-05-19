import express, { ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './infrastructure/routes/authRoutes';
import companyRoutes from './infrastructure/routes/companyRoutes';
import { notFoundHandler, globalErrorHandler } from './infrastructure/middlewares/errorMiddleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;