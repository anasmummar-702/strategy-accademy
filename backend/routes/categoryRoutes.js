import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const categoryRouter = express.Router();
categoryRouter.get('/', getCategories);
categoryRouter.post('/', requireAuth, createCategory);
categoryRouter.put('/:id', requireAuth, updateCategory);
categoryRouter.delete('/:id', requireAuth, deleteCategory);

export const collectionRouter = express.Router();
collectionRouter.get('/', getCollections);
collectionRouter.post('/', requireAuth, createCollection);
collectionRouter.put('/:id', requireAuth, updateCollection);
collectionRouter.delete('/:id', requireAuth, deleteCollection);
