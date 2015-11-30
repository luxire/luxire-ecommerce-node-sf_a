'use strict';

var express =  require('express');
var controller = require('./order.controller');
var router = express.Router();

router.get('/',controller.index);
router.get('/:number/:token', controller.show);
router.post('/', controller.create);
router.post('/new', controller.create_blank_order);
router.post('/:number/line_item', controller.add_line_item);
router.put('/', controller.update);

module.exports = router;