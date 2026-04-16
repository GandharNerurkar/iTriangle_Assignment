const app = require('./app');
const { port } = require('./core/config/env');
const db = require('./core/config/db');

async function startServer() {
  try {
    const client = await db.getClient();
    client.release();
    console.info('Database connection validated successfully');

    app.listen(port, () => {
      console.info(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message || error);
    process.exit(1);
  }
}

startServer();
