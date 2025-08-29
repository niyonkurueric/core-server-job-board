import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import setupSwagger from './swagger.js';
import { initializeDatabase } from './config/db.init.js';
import { seedDatabase } from './services/seed.service.js';

const app = express();

app.use(express.json());

app.use(cors());

// Initialize database for Vercel
app.use(async (req, res, next) => {
  try {
    await initializeDatabase();
    await seedDatabase();
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    next(error);
  }
});

app.use('/api', routes);

// Swagger docs
setupSwagger(app);

// error handler (must be last)
app.use(errorMiddleware);

export default app;
