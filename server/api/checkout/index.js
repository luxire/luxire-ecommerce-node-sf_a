'use strict';

var express = require('express');
var controller = require('./checkout.controller');

var router = express.Router();

router.post('/:number/next',controller.checkout_address);

module.exports = router;
