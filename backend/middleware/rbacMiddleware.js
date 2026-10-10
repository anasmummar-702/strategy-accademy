import { sendError } from '../utils/responseHelper.js';

export const requirePermission = (requiredModule, requiredAction = 'view') => {
  return (req, res, next) => {
    if (!req.adminUser) {
      return sendError(res, 'Authentication required', 401, null, 'AUTH_REQUIRED');
    }

    const { roleName, permissions = [] } = req.adminUser;

    // Super Admin has full unrestricted access
    if (roleName === 'Super Admin') {
      return next();
    }

    // Check module permission matrix
    const hasPermission = permissions.some((p) => {
      const moduleMatch = p.module === requiredModule || p.module === '*';
      const actionMatch = p.action === requiredAction || p.action === '*';
      return moduleMatch && actionMatch;
    });

    if (!hasPermission) {
      return sendError(
        res,
        `Access denied. You do not have permission to '${requiredAction}' in '${requiredModule}'.`,
        403,
        null,
        'FORBIDDEN'
      );
    }

    next();
  };
};
