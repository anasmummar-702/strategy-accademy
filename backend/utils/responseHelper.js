/**
 * Standardized JSON API Response Envelope Generator
 * Envelope format: { success, data, error, meta }
 */

export const sendSuccess = (res, data = {}, meta = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta,
    error: null
  });
};

export const sendError = (res, message = 'An unexpected error occurred', statusCode = 400, details = null, code = 'ERROR') => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    meta: null,
    error: {
      code,
      message,
      details
    }
  });
};
