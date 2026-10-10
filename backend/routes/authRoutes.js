import { Router } from 'express';
import { login, getCurrentUser, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateMiddleware.js';
import { loginSchema } from '../validators/authValidator.js';

const router = Router();

router.post('/login', validateRequest(loginSchema), login);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', requireAuth, logout);

export default router;
