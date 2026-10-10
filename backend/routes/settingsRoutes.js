import express from 'express';
import {
  getCoupons,
  createCoupon,
  getReviews,
  updateReviewStatus,
  getSettings,
  updateSettings,
  getAdminUsers,
  getAuditLogs,
} from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const settingsRouter = express.Router();
settingsRouter.get('/coupons', getCoupons);
settingsRouter.post('/coupons', requireAuth, createCoupon);
settingsRouter.get('/reviews', getReviews);
settingsRouter.put('/reviews/:id', requireAuth, updateReviewStatus);
settingsRouter.get('/store-settings', getSettings);
settingsRouter.put('/store-settings', requireAuth, updateSettings);
settingsRouter.get('/users', requireAuth, getAdminUsers);
settingsRouter.get('/audit-logs', requireAuth, getAuditLogs);
