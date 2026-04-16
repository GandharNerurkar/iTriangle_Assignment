const ApiError = require('../utils/apiError');

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data || undefined,
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
}

module.exports = errorHandler;
