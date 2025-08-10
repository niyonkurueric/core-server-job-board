import express from 'express';
import * as appCtrl from '../controllers/applications.controller.js';
import { authenticate, validateBody } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { applicationSchema } from '../validations/validators.js';
const router = express.Router();

router.post('/', authenticate, validateBody(applicationSchema), appCtrl.apply);

router.get('/me', authenticate, appCtrl.getMine);

router.get('/job/:jobId', authenticate, requireRole('admin'), appCtrl.getByJob);

export default router;
