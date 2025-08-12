import express from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, requireRole('admin'), getAnalytics);

export default router;
