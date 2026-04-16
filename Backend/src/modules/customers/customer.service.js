const customerModel = require('./customer.model');
const ApiError = require('../../core/utils/apiError');
const { validateEmail } = require('../../core/utils/validators');

async function createCustomer({ name, email, phone }) {
  if (!name || !email) {
    throw new ApiError(400, 'Name and email are required');
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, 'Invalid email format');
  }

  const existing = await customerModel.getCustomerByEmail(email);
  if (existing) {
    throw new ApiError(409, 'Customer already exists');
  }

  return customerModel.createCustomer({ name, email, phone });
}

async function getCustomers() {
  return customerModel.getCustomers();
}

async function updateCustomer(id, { name, email, phone }) {
  if (!name && !email && !phone) {
    throw new ApiError(400, 'At least one field is required to update');
  }

  const customer = await customerModel.getCustomerById(id);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  if (email && !validateEmail(email)) {
    throw new ApiError(400, 'Invalid email format');
  }

  if (email) {
    const existing = await customerModel.getCustomerByEmail(email);
    if (existing && existing.id !== Number(id)) {
      throw new ApiError(409, 'Email is already in use');
    }
  }

  return customerModel.updateCustomer(id, { name, email, phone });
}

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
};
