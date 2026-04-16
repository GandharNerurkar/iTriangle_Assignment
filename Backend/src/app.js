const express = require('express');
const cors = require('cors');
const routes = require('./modules');
const requestLogger = require('./core/middlewares/requestLogger');
const errorHandler = require('./core/middlewares/errorHandler');
const notFoundHandler = require('./core/middlewares/notFound');
require('./core/config/env');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
