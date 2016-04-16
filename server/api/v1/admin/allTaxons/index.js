'use strict';

var express = require('express');
var controller = require('./allTaxons.controller');

var router = express.Router();

router.get('/', controller.getAllTaxons);


module.exports = router;
