import jwt from 'jsonwebtoken';
import { sendError } from '../utils/responseHelper.js';

const JWT_SECRET = process.env.JWT_SECRET || 'strategy_super_secret_jwt_key_32_chars_min_2026';

export const requireAuth = (req, res, next) => {
  try {
    let token = null;

    // Check HttpOnly Cookie or Authorization Header
    if (req.cookies && req.cookies.admin_token) {
      token = req.cookies.admin_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please log in to continue.', 401, null, 'AUTH_REQUIRED');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminUser = decoded;
    next();
  } catch (err) {
    return sendError(res, 'Invalid or expired session token', 401, null, 'INVALID_TOKEN');
  }
};
