'use strict';

var express = require('express');
var controller = require('./contact_us.controller');

var router = express.Router();
router.post('/', controller.contact_us)

module.exports = router;
