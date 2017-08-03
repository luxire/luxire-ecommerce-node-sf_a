'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./helpPage.controller');

router.post('/update', controller.updateAttributeHelpDetails);

module.exports = router;
