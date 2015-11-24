'use strict';

var express = require('express');
var controller = require('./checkout.controller');

var router = express.Router();

router.post('/:number/next',controller.checkout_address);
router.post('/:number/delivery', controller.checkout_delivery);
router.post('/:number/payment', controller.checkout_payment);

module.exports = router;
