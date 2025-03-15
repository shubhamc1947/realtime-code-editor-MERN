// errorMiddleware.js

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.error(err.stack);
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(isDevelopment && { stack: err.stack })
    }
  });
};

module.exports = {
  ApiError,
  notFound,
  errorHandler
};