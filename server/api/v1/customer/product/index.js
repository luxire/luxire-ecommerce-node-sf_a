'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./product.controller');

/*Products*/
router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:id/variants', controller.productVariants);

module.exports = router;
