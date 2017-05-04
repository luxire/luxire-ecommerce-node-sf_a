'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./product.controller');

router.get('/getAllProducts', controller.getProductsFromRedis);
router.get('/', controller.index);
router.get('/search', controller.searchProduct);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/csv', controller.csv_import);
router.post('/:product_id/variants/:variant_id/images', controller.add_variant_image);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/:id/variants', controller.productVariants);
router.post('/sync_spree_redis', controller.sync_spree_redis);


module.exports = router;
