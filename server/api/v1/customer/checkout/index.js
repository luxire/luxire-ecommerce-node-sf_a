'use strict';

var express = require('express');
var controller = require('./checkout.controller');

var router = express.Router();

router.post('/:number/address', controller.checkout_address);
router.post('/:number/delivery', controller.checkout_delivery);
router.post('/:number/payment', controller.checkout_payment);
router.post('/:number/pay_pal_payment', controller.checkout_pay_pal_payment);

// router.post('/:number/:token/gateway', controller.checkout_gateway);
router.post('/:number/apply_coupon_code/:code', controller.checkout_apply_coupon_code);
router.post('/:number/apply_gift_card', controller.checkout_apply_gift_card);
router.post('/gateway_Response', controller.checkout_gateway_response);
router.post('/:number/confirm', controller.checkout_confirm_payment);
router.post('/:number/auto_complete', controller.checkout_auto_complete);
router.post('/:number/complete', controller.checkout_complete);

/*Brain tree configuration*/
router.post('/:number/payments/brain_tree_init', controller.brain_tree_init);
router.post('/:number/payments/brain_tree', controller.brain_tree_payment);



module.exports = router;
