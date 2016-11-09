'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.contact_us = function(req, res){
  console.log('req.body', req.body);
  res.status(200).send('');
};
