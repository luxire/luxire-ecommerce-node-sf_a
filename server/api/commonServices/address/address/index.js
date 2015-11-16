'user strict';

var express = require('express');
var controller = require('./address.controller');

var router = express.Router();

router.get('/countries', controller.countries);
// router.get('/states', controller.states);


module.exports = router;
