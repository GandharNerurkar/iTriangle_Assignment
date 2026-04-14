class ApiError extends Error {
  constructor(statusCode, message, data = null) {
    super(message);
    this.statusCode = statusCode || 500;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
