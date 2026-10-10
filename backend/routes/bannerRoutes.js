import express from 'express';
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBanners);
router.post('/', requireAuth, createBanner);
router.put('/:id', requireAuth, updateBanner);
router.delete('/:id', requireAuth, deleteBanner);

export default router;
