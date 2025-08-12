import express from 'express';
import { validateBody, authenticate } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from '../validations/validators.js';
import * as authCtrl from '../controllers/auth.controller.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
const { listUsers } = authCtrl;

const router = express.Router();

router.post('/register', validateBody(registerSchema), authCtrl.register);
router.post('/login', validateBody(loginSchema), authCtrl.login);
router.post('/google', authCtrl.googleLogin);

// List all users (admin only)
router.get('/users', authenticate, requireAdmin, listUsers);

export default router;
