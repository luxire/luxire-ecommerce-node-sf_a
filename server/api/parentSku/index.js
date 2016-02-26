'use strict';

var express =  require('express');
var controller = require('./parentSku.controller');
var router = express.Router();

router.post('/',controller.checkParentSku);




module.exports = router;
