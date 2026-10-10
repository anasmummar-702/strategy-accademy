import jwt from 'jsonwebtoken';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { recordAuditLog } from '../services/auditService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'strategy_super_secret_jwt_key_32_chars_min_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Mock DB Admin Users for initial boot testing
const DEMO_ADMIN = {
  id: 'a1111111-aaaa-1111-aaaa-111111111111',
  email: 'admin@strategy.ae',
  full_name: 'Master Admin',
  role_id: '11111111-1111-1111-1111-111111111111',
  roleName: 'Super Admin',
  permissions: [{ module: '*', action: '*' }]
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Verify credentials (Demo Super Admin: admin@strategy.ae / Password123!)
    if (email.toLowerCase() !== 'admin@strategy.ae' || password !== 'Password123!') {
      return sendError(res, 'Invalid email or password', 401, null, 'INVALID_CREDENTIALS');
    }

    const payload = {
      id: DEMO_ADMIN.id,
      email: DEMO_ADMIN.email,
      fullName: DEMO_ADMIN.full_name,
      roleName: DEMO_ADMIN.roleName,
      permissions: DEMO_ADMIN.permissions
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set HttpOnly Cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    });

    await recordAuditLog({
      adminUserId: DEMO_ADMIN.id,
      adminEmail: DEMO_ADMIN.email,
      action: 'LOGIN',
      module: 'AUTH',
      req
    });

    return sendSuccess(res, {
      token,
      user: payload
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    return sendSuccess(res, {
      user: req.adminUser
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.adminUser) {
      await recordAuditLog({
        adminUserId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: 'LOGOUT',
        module: 'AUTH',
        req
      });
    }

    res.clearCookie('admin_token');
    return sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
