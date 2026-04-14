const productService = require('../services/productService');
const { sendSuccess } = require('../utils/response');

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    sendSuccess(res, product, 'Product created successfully');
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    sendSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};
