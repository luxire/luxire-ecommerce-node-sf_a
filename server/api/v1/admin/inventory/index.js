'use strict';

var express =  require('express');
var controller = require('./inventory.controller');
var router = express.Router();
router.get('/', controller.luxireStocks_index);
router.put('/:id', controller.updateStock);
router.get('/:id', controller.luxireStocks_byId);
router.post('/add_stocks', controller.luxireStocks_addQuantity);
router.post('/set_stocks', controller.luxireStocks_setQuantity);

module.exports = router;
