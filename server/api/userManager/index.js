'use strict';

var express = require('express');
var controller = require('./userManager.controller');

var router = express.Router();

router.get('/', controller.index);
router.post('/login', controller.login);
router.post('/signup', controller.signup)

module.exports = router;
