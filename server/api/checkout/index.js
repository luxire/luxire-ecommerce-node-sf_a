'use strict';

var express = require('express');
var controller = require('./checkout.controller');

var router = express.Router();

router.post('/:number/:token/next',controller.checkout_address);
router.post('/:number/:token/delivery', controller.checkout_delivery);
router.post('/:number/:token/payment', controller.checkout_payment);
router.post('/:number/:token/gateway', controller.checkout_gateway);
router.post('/:number/:token/apply_coupon_code/:code', controller.checkout_apply_coupon_code);
router.post('/gateway_Response', controller.checkout_gateway_response);
router.get('/', controller.check);
// router.post('/:number/next',controller.checkout_address);
// router.post('/:number/delivery', controller.checkout_delivery);
// router.post('/:number/payment', controller.checkout_payment);
// router.post('/:number/gateway', controller.checkout_gateway);
// router.post('/:number/apply_coupon_code/:code', controller.checkout_apply_coupon_code);
// router.post('/gateway_Response', controller.checkout_gateway_response);
// router.get('/', controller.check);

module.exports = router;
