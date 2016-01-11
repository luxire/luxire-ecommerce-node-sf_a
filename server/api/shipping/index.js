'use strict';

var express =  require('express');
var controller = require('./shipping.controller');
var router = express.Router();

router.get('/:id/:token', controller.get_stock_location);
router.put('/:id/:token', controller.update_stock_location);

router.get('/carriers', controller.get_carrier_details);
router.put('/carriers', controller.update_carrier_details);

router.get('/shipping_methods', controller.index_shipping_method);
router.get('/shipping_methods_new', controller.new_shipping_method);
router.post('/shipping_methods', controller.create_shipping_method);
router.delete('/shipping_methods/:id', controller.destroy_shipping_method);

// router.get('')


module.exports = router;
