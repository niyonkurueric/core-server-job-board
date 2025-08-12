import express from 'express';
import * as appCtrl from '../controllers/applications.controller.js';
import { authenticate, validateBody } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { applicationSchema } from '../validations/validators.js';
import { preventDuplicateApplication } from '../middlewares/preventDuplicateApplication.middleware.js';
const router = express.Router();

router.post(
  '/',
  authenticate,
  preventDuplicateApplication,
  validateBody(applicationSchema),
  appCtrl.apply
);

router.get('/me', authenticate, appCtrl.getMine);

router.get(
  '/all',
  authenticate,
  requireRole('admin'),
  appCtrl.listAllApplications
);
router.get('/job/:jobId', authenticate, requireRole('admin'), appCtrl.getByJob);

router.get(
  '/admin/jobs-applications',
  authenticate,
  requireRole('admin'),
  appCtrl.listJobsWithApplications
);

export default router;
