'use strict';

var express = require('express');
var controller = require('./userManager.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/login',controller.login);

module.exports = router;
