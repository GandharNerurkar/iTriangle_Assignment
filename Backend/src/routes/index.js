const express = require('express');
const customerRoutes = require('./customerRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');

const router = express.Router();

router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
