const ApiError = require('../utils/apiError');

function notFoundHandler(req, res, next) {
  next(new ApiError(404, 'Resource not found'));
}

module.exports = notFoundHandler;
