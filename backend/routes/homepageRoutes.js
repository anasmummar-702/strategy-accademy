import express from 'express';
import {
  getHomepageSections,
  reorderHomepageSections,
  updateHomepageSection,
} from '../controllers/homepageController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHomepageSections);
router.put('/reorder', requireAuth, reorderHomepageSections);
router.put('/sections/:key', requireAuth, updateHomepageSection);

export default router;
