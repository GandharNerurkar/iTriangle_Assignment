const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const schemaPath = path.resolve(__dirname, '../../sql/schema.sql');
const rawSchema = fs.readFileSync(schemaPath, 'utf8');

function normalizeStatements(sql) {
  return sql
    .split(';')
    .map((statement) =>
      statement
        .split('\n')
        .map((line) => line.replace(/--.*$/, ''))
        .join('\n')
        .trim()
    )
    .filter((statement) => statement.length > 0);
}

async function initDatabase() {
  const client = await db.getClient();
  const statements = normalizeStatements(rawSchema);

  try {
    await client.query('BEGIN');
    for (const statement of statements) {
      await client.query(statement);
    }
    await client.query('COMMIT');
    console.info('Database schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to initialize database schema:', error.message || error);
    process.exit(1);
  } finally {
    client.release();
  }
}

initDatabase();
