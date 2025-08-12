import express from 'express';

import authRoutes from './auth.routes.js';
import jobsRoutes from './jobs.routes.js';
import applicationsRoutes from './applications.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
