import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { errors } from 'celebrate';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';

// import rateLimiter from 'express-rate-limiter';
// import hpp from 'hpp';

import userRouter from './routes/userRoutes.js';
import carRouter from './routes/carRoutes.js';
import dealerRouter from './routes/dealerRoutes.js';
import globalErrorHandler from './controller/globalErrorHandler.js';
import AppError from './utils/appError.js';
import cookieParser from 'cookie-parser';

dotenv.config({ path: 'config.env' });

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//
app.use(helmet());

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

// Cookir Parser
app.use(cookieParser());

app.use('/api/v1/cars', carRouter);
app.use('/api/v1/dealer', dealerRouter);
app.use('/api/v1/auth', userRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`No ${req.originalUrl} found on this server`, 404));
});

app.use(errors());

app.use(globalErrorHandler);

export default app;
