const db = require('../../core/config/db');

async function createCustomer({ name, email, phone }) {
  const result = await db.query(
    'INSERT INTO customers (name, email, phone) VALUES ($1, $2, $3) RETURNING id, name, email, phone, created_at',
    [name, email, phone]
  );
  return result.rows[0];
}

async function getCustomers() {
  const result = await db.query(
    'SELECT id, name, email, phone, created_at FROM customers ORDER BY created_at DESC'
  );
  return result.rows;
}

async function getCustomerById(id) {
  const result = await db.query(
    'SELECT id, name, email, phone, created_at FROM customers WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function getCustomerByEmail(email) {
  const result = await db.query(
    'SELECT id, name, email, phone, created_at FROM customers WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

async function updateCustomer(id, { name, email, phone }) {
  const result = await db.query(
    'UPDATE customers SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone) WHERE id = $4 RETURNING id, name, email, phone, created_at',
    [name, email, phone, id]
  );
  return result.rows[0];
}

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  getCustomerByEmail,
  updateCustomer,
};
