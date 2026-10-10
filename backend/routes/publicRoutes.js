import express from 'express';
import {
  getPublicStorefrontInit,
  getPublicHomepage,
  getPublicProducts,
  getPublicProductBySlug,
  getPublicCategories,
  getPublicCollections,
  getPublicPrograms,
  getPublicCoaches,
  submitPublicOrder,
  submitPublicEnquiry,
} from '../controllers/publicController.js';

const router = express.Router();

router.get('/storefront/init', getPublicStorefrontInit);
router.get('/homepage', getPublicHomepage);
router.get('/products', getPublicProducts);
router.get('/products/:slug', getPublicProductBySlug);
router.get('/categories', getPublicCategories);
router.get('/collections', getPublicCollections);
router.get('/programs', getPublicPrograms);
router.get('/coaches', getPublicCoaches);
router.post('/orders', submitPublicOrder);
router.post('/enquiries', submitPublicEnquiry);

export default router;
