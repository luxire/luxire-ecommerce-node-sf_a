'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./product.controller');

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
router.get('/:id/variants', controller.productVariants);

module.exports = router;
