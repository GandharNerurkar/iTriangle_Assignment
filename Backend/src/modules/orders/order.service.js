const db = require('../../core/config/db');
const ApiError = require('../../core/utils/apiError')

async function createOrder({ customer_id, items }) {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    if (!items || items.length === 0) {
      throw new ApiError(400, "Items are required");
    }

    //Check customer exists
    const customerResult = await client.query(
      'SELECT id FROM customers WHERE id = $1',
      [customer_id]
    );

    if (customerResult.rowCount === 0) {
      throw new ApiError(404, "Customer not found");
    }

    let subtotal = 0;

    const processedItems = [];

    for (const item of items) {
      if (!item.product_id || !item.quantity) {
        throw new ApiError(400, "Invalid item format");
      }

      // Get product details
      const productResult = await client.query(
        'SELECT name, price, stock FROM products WHERE id = $1',
        [item.product_id]
      );

      if (productResult.rowCount === 0) {
        throw new ApiError(404, `Product ${item.product_id} not found`);
      }

      const { name, price, stock } = productResult.rows[0];


      if (stock === 0) {
        throw new ApiError(400, `${name} is out of stock`);
      }

      //  NOT ENOUGH STOCK
      if (stock < item.quantity) {
        throw new ApiError(400, `Only ${stock} items available for product ${name}`);
      }

      // Calculate subtotal
      subtotal += item.quantity * price;

      processedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price,
      });
    }

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Insert order
    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, subtotal, tax, total) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, customer_id, subtotal, tax, total, created_at`,
      [customer_id, subtotal, tax, total]
    );

    const order = orderResult.rows[0];

    // Insert order items + update stock
    for (const item of processedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      // Deduct stock
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    await client.query('COMMIT');

    return {
      ...order,
      items: processedItems,
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