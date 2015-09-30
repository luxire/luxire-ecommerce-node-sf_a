'user strict';

var express = require('express');
var controller = require('./country.controller');

var router = express.Router();

router.get('/', controller.index);
// router.get('/states', controller.states);


module.exports = router;
