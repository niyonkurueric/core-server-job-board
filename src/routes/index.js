import express from 'express';

import authRoutes from './auth.routes.js';
import jobsRoutes from './jobs.routes.js';
import applicationsRoutes from './applications.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

import { requireAdmin } from '../middlewares/admin.middleware.js';
import { listJobsWithApplications } from '../controllers/applications.controller.js';

router.use('/auth', authRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/analytics', analyticsRoutes);

// Admin: list all jobs with their applications
router.get('/admin/jobs-applications', requireAdmin, listJobsWithApplications);

export default router;
