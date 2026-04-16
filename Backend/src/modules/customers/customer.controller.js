const customerService = require('./customer.service');
const { sendSuccess } = require('../../core/utils/response');

exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(req.body);
    sendSuccess(res, customer, 'Customer created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getCustomers();
    sendSuccess(res, customers);
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.updateCustomer(req.params.id, req.body);
    sendSuccess(res, customer, 'Customer updated successfully');
  } catch (error) {
    next(error);
  }
};
