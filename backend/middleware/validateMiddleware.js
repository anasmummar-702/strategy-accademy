import { sendError } from '../utils/responseHelper.js';

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params
      });
      req.validated = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const details = err.errors.map((e) => ({
          field: e.path.join('.').replace(/^(body|query|params)\./, ''),
          message: e.message
        }));
        return sendError(res, 'Validation failed for request payload', 422, details, 'VALIDATION_ERROR');
      }
      next(err);
    }
  };
};
