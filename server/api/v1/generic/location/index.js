'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./location.controller');

/*Products*/
router.get('/', controller.geo_location);

module.exports = router;