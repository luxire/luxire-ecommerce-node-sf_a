'use strict';

var express =  require('express');
var controller = require('./myAccount.controller');
var router = express.Router();


router.post('/', controller.myAccount);


module.exports = router;
