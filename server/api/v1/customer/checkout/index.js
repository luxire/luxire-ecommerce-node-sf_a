'use strict';

var express = require('express');
var controller = require('./checkout.controller');

var router = express.Router();

router.post('/:number/address', controller.checkout_address);
router.post('/:number/delivery', controller.checkout_delivery);
router.post('/:number/payment', controller.checkout_payment);
// router.post('/:number/:token/gateway', controller.checkout_gateway);
router.post('/:number/apply_coupon_code/:code', controller.checkout_apply_coupon_code);
router.post('/gateway_Response', controller.checkout_gateway_response);
router.post('/:number/confirm', controller.checkout_confirm_payment);
router.post('/:number/complete', controller.checkout_complete);


module.exports = router;
