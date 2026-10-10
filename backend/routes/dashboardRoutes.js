import express from 'express';
import { getDashboardKpis } from '../controllers/dashboardController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/admin/dashboard/kpis
router.get('/kpis', requireAuth, getDashboardKpis);

export default router;
