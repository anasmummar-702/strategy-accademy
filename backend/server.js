import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { categoryRouter, collectionRouter } from './routes/categoryRoutes.js';
import homepageRoutes from './routes/homepageRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { academyRouter, customerRouter } from './routes/academyRoutes.js';
import { settingsRouter } from './routes/settingsRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// Security & Parsing Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Static File Storage Serving
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', brand: 'STRATEGY Athletics & Gear', timestamp: new Date().toISOString() });
});

// API Routes
app.use(`${API_PREFIX}/public`, publicRoutes);
app.use(`${API_PREFIX}/admin/auth`, authRoutes);
app.use(`${API_PREFIX}/admin/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/admin/products`, productRoutes);
app.use(`${API_PREFIX}/admin/categories`, categoryRouter);
app.use(`${API_PREFIX}/admin/collections`, collectionRouter);
app.use(`${API_PREFIX}/admin/homepage`, homepageRoutes);
app.use(`${API_PREFIX}/admin/banners`, bannerRoutes);
app.use(`${API_PREFIX}/admin/orders`, orderRoutes);
app.use(`${API_PREFIX}/admin/academy`, academyRouter);
app.use(`${API_PREFIX}/admin/customers`, customerRouter);
app.use(`${API_PREFIX}/admin/settings`, settingsRouter);

// Error & 404 Handlers
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 STRATEGY Control Center API running on port ${PORT}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`🔒 Auth Endpoint: http://localhost:${PORT}${API_PREFIX}/admin/auth/login`);
  });
}

export default app;
