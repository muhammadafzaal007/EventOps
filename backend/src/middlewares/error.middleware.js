import multer from 'multer';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Converts known error types into a consistent JSON response
const normalizeError = (err) => {
  if (err instanceof ApiError) return err;

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 2MB)' : err.message;
    return new ApiError(400, message);
  }
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.fromEntries(
      Object.entries(err.errors).map(([key, e]) => [key, e.message])
    );
    return new ApiError(400, 'Validation failed', errors);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return new ApiError(409, `${field} already exists`);
  }
  if (err.name === 'CastError') return new ApiError(400, `Invalid ${err.path}`);
  if (err.type === 'entity.parse.failed') return new ApiError(400, 'Invalid JSON body');

  return err;
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);
  const statusCode = error.statusCode || 500;

  if (statusCode === 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 && env.nodeEnv === 'production' ? 'Server error' : error.message,
    errors: error.errors,
    stack: env.nodeEnv === 'production' ? undefined : error.stack,
  });
};
