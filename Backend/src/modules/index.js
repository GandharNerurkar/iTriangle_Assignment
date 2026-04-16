const express = require('express');
const customerRoutes = require('./customers/customer.routes');
const productRoutes = require('./products/product.routes');
const orderRoutes = require('./orders/order.routes');

const router = express.Router();

router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
