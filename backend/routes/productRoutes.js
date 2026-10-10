import express from 'express';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateProducts
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', requireAuth, createProduct);
router.put('/bulk', requireAuth, bulkUpdateProducts);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
