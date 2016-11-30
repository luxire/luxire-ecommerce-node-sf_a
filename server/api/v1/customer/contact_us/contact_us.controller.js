'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.contact_us = function(req, res){
  console.log('req.body from user', req.body);
  http
    .post({
      uri: constants.spree.host+constants.spree.contact_us,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(req.body)
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        console.log('response from contact us', body);
        res.status(response.statusCode).send(body);
      };

  });
};
