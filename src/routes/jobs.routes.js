import express from 'express';
import * as jobsCtrl from '../controllers/jobs.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, requireRole('admin'), jobsCtrl.listJobs);
router.get('/locations', jobsCtrl.getAllLocations);
router.get('/published', jobsCtrl.listPublishedJobs);
router.get('/:id', jobsCtrl.getJob);

router.post('/', authenticate, requireRole('admin'), jobsCtrl.createJob);

router.put('/:id', authenticate, requireRole('admin'), jobsCtrl.updateJob);

router.delete('/:id', authenticate, requireRole('admin'), jobsCtrl.deleteJob);

export default router;
