'use strict';

var express =  require('express');
var controller = require('./shipping.controller');
var router = express.Router();

router.get('/:id/:token', controller.get_stock_location);
router.put('/:id/:token', controller.update_stock_location);

module.exports = router;
