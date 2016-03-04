'use strict';
var express =  require('express');
var controller = require('./product_type.controller');
var router = express.Router();
router.get('/',controller.getAllProductType);
router.get('/standard_sizes', controller.standard_sizes);
router.get('/:id',controller.getProductTypeById);
module.exports = router;
