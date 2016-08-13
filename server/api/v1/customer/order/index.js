'use strict';

var express =  require('express');
var controller = require('./order.controller');
var router = express.Router();

router.get('/',controller.index);
router.get('/my_account',controller.my_account);
router.get('/incomplete', controller.incomplete_order);
router.get('/:number', controller.show);//order_token passed as query param
router.post('/', controller.create);
router.post('/new', controller.create_blank_order);
router.post('/:number/apply_coupon_code/:code', controller.checkout_apply_coupon_code);
router.put('/:number', controller.update);//order_token passed as query param
router.put('/:number/empty', controller.empty_cart);//order_token passed as query param

router.put('/:number/update_order_currency', controller.update_order_currency);


/**Line Items**/
router.post('/:number/line_items', controller.add_line_item);//order_token passed as query param
router.put('/:number/line_items/:id', controller.update_line_item);//order_token passed as query param
router.delete('/:number/line_items/:id', controller.delete_line_item);//order_token passed as query param

/**Payments**/
router.get('/:number/payments/new', controller.new_payment);
router.post('/:number/payments', controller.create_payment);
router.post('/:number/payments/complete', controller.complete_payment);


// router.put('/', controller.update);

module.exports = router;
