import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import routes from './routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';
import setupSwagger from './swagger.js';

const app = express();

app.use(express.json());

app.use(cors());

app.use('/api', routes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// Swagger docs
setupSwagger(app);

// error handler (must be last)
app.use(errorMiddleware);

export default app;
