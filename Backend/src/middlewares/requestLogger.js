function requestLogger(req, res, next) {
  console.info(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}

module.exports = requestLogger;
