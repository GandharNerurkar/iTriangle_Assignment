const orderService = require('./order.service');
const { sendSuccess } = require('../../core/utils/response');

exports.createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    sendSuccess(res, order, 'Order created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders();
    sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};
