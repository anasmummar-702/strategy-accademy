import express from 'express';
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', requireAuth, updateOrderStatus);

export default router;
