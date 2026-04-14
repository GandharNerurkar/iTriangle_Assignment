const db = require('../config/db');

async function createOrder({ customer_id, items }) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    if (!items || items.length === 0) {
      throw new Error("Items are required");
    }

    //this will calculate the values
    let subtotal = 0;

    for (const item of items) {
      subtotal += item.quantity * item.price;
    }

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, subtotal, tax, total) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, customer_id, subtotal, tax, total, created_at`,
      [customer_id, subtotal, tax, total]
    );

    const order = orderResult.rows[0];

    const insertPromises = items.map((item) =>
      client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      )
    );

    await Promise.all(insertPromises);

    await client.query('COMMIT');

    return {
      ...order,
      items,
    };
  } catch (error) {
    console.error("ORDER ERROR:", error);
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getOrders() {
  const result = await db.query(
    `SELECT
      o.id,
      o.customer_id,
      c.name AS customer_name,
      o.subtotal,
      o.tax,
      o.total,
      o.created_at
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    ORDER BY o.created_at DESC`
  );

  return result.rows;
}

async function getOrderById(id) {
  const orderResult = await db.query(
    `SELECT
      o.id,
      o.customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      o.subtotal,
      o.tax,
      o.total,
      o.created_at
    FROM orders o
    JOIN customers c ON c.id = o.customer_id
    WHERE o.id = $1`,
    [id]
  );

  const order = orderResult.rows[0];
  if (!order) return null;

  const itemResult = await db.query(
    `SELECT
      oi.id,
      oi.product_id,
      p.name AS product_name,
      oi.quantity,
      oi.price
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = $1`,
    [id]
  );

  return {
    ...order,
    items: itemResult.rows,
  };
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
