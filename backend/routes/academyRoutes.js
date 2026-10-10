import express from 'express';
import {
  getCoaches,
  getPrograms,
  getBookings,
  updateBookingStatus,
  getCustomers,
} from '../controllers/academyController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

export const academyRouter = express.Router();
academyRouter.get('/coaches', getCoaches);
academyRouter.get('/programs', getPrograms);
academyRouter.get('/bookings', getBookings);
academyRouter.put('/bookings/:id', requireAuth, updateBookingStatus);

export const customerRouter = express.Router();
customerRouter.get('/', getCustomers);
