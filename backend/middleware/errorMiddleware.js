import { sendError } from '../utils/responseHelper.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[API ERROR] ${req.method} ${req.originalUrl}:`, err);

  // Handle Zod Schema Validation Errors
  if (err.name === 'ZodError') {
    const formattedDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return sendError(res, 'Validation error', 422, formattedDetails, 'VALIDATION_ERROR');
  }

  // Handle Unauthorized / JWT Errors
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid or expired authentication token', 401, null, 'UNAUTHORIZED');
  }

  // Handle DB Duplicate Key Errors
  if (err.code === '23505') {
    return sendError(res, 'A record with this unique identifier already exists', 409, null, 'DUPLICATE_RECORD');
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500 
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';

  return sendError(res, message, statusCode, null, 'SERVER_ERROR');
};

export const notFoundHandler = (req, res) => {
  return sendError(res, `API route not found: ${req.method} ${req.originalUrl}`, 404, null, 'NOT_FOUND');
};
