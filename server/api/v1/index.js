/*Basic routing for customer/admin/general api*/
'use strict';
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var express = require('express');
var app = express();
console.log('v1 index', Date.now());
app.on('mount', function(parent){
  console.log('api v1 mounted');
})
app.use('/admin', require('./admin'));
// app.use('/generic', require('./generic'));
app.use('/', require('./customer'));


module.exports = app;
