const express = require('express');
const router = express.Router();
const customerController = require('./customer.controller');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getCustomers);
router.put('/:id', customerController.updateCustomer);

module.exports = router;
