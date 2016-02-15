'use strict';

var express =  require('express');
var controller = require('./style_master.controller');
var router = express.Router();

router.get('/',controller.styleMastersIndex);
router.get('/:id',controller.getStyleMastersById);
module.exports = router;
