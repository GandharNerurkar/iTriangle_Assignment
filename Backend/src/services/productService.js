const productModel = require('../models/productModel');
const ApiError = require('../utils/apiError');

async function createProduct({ name, price }) {
  if (!name || price === undefined) {
    throw new ApiError(400, 'Name and price are required');
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    throw new ApiError(400, 'Price must be a non-negative number');
  }

  return productModel.createProduct({ name, price: numericPrice });
}

async function getProducts() {
  return productModel.getProducts();
}

async function updateProduct(id, { name, price }) {
  if (!name && price === undefined) {
    throw new ApiError(400, 'At least one field is required to update');
  }

  const product = await productModel.getProductById(id);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (price !== undefined) {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      throw new ApiError(400, 'Price must be a non-negative number');
    }
    price = numericPrice;
  }

  return productModel.updateProduct(id, { name, price });
}

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
};
