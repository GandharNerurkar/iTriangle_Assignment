const customerModel = require('../models/customerModel');
const productModel = require('../models/productModel');
const orderModel = require('../models/orderModel');
const ApiError = require('../utils/apiError');
const { validatePositiveInteger } = require('../utils/validators');

async function createOrder({ customer_id, items }) {
  const customerId = Number(customer_id);
  if (!validatePositiveInteger(customerId) || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'customer_id and a non-empty items array are required');
  }

  const customer = await customerModel.getCustomerById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  const productIds = items.map((item) => Number(item.product_id));
  if (!productIds.every(validatePositiveInteger)) {
    throw new ApiError(400, 'Each product_id must be a positive integer');
  }

  const products = await productModel.getProductsByIds(productIds);
  if (products.length !== productIds.length) {
    throw new ApiError(404, 'One or more products were not found');
  }

  const productMap = new Map(products.map((product) => [product.id, product]));
  let subtotal = 0;

  const formattedItems = items.map(({ product_id, quantity }) => {
    const productId = Number(product_id);
    if (!validatePositiveInteger(quantity)) {
      throw new ApiError(400, 'Quantity must be a positive integer');
    }

    const product = productMap.get(productId);
    const itemPrice = Number(product.price);
    subtotal += itemPrice * quantity;

    return {
      product_id: productId,
      quantity,
      price: itemPrice,
    };
  });

  const tax = Number((subtotal * 0.18).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  return orderModel.createOrder({
    customer_id: customerId,
    subtotal,
    tax,
    total,
    stock: 0,
    items: formattedItems,
  });
}

async function getOrders() {
  return orderModel.getOrders();
}

async function getOrderById(id) {
  const order = await orderModel.getOrderById(id);
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  return order;
}

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
};
