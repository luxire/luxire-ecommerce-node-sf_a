'use strict';
var express =  require('express');
var controller = require('./product_type.controller');
var router = express.Router();
router.get('/',controller.getAllProductType);
router.get('/:id',controller.getProductTypeById);
module.exports = router;
