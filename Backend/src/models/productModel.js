const db = require('../config/db');

async function createProduct({ name, price }) {
  const result = await db.query(
    'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price, created_at',
    [name, price]
  );
  return result.rows[0];
}

async function getProducts() {
  const result = await db.query(
    'SELECT id, name, price, created_at FROM products ORDER BY created_at DESC'
  );
  return result.rows;
}

async function getProductById(id) {
  const result = await db.query(
    'SELECT id, name, price, created_at FROM products WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

async function getProductsByIds(ids) {
  const query = 'SELECT id, name, price FROM products WHERE id = ANY($1)';
  const result = await db.query(query, [ids]);
  return result.rows;
}

async function updateProduct(id, { name, price }) {
  const result = await db.query(
    'UPDATE products SET name = COALESCE($1, name), price = COALESCE($2, price) WHERE id = $3 RETURNING id, name, price, created_at',
    [name, price, id]
  );
  return result.rows[0];
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductsByIds,
  updateProduct,
};
