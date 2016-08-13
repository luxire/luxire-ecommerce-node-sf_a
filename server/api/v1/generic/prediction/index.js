'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./prediction.controller');

/*Products*/
router.post('/', controller.create);

module.exports = router;
