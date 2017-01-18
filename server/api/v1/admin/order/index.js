'use strict';

var express =  require('express');
var controller = require('./order.controller');
var router = express.Router();

router.get('/',controller.index);
router.put('/update_status', controller.update_status);
router.put('/update_line_item_status', controller.update_line_item_status);
router.get('/:number', controller.show);

module.exports = router;
