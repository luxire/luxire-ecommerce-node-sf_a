'use strict';

var _ = require('lodash');
var http = require('request');
var querystring = require('querystring');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');

exports.create = function(data){
  console.log('create recommendation data', data);
  http
    .post({
      uri: constants.prediction.feed_host + constants.prediction.feed_url + constants.prediction.feed_access_key,
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(data)
    }, function(error, response, body){
        if(error){
          console.log('err in populating prediction: ', error.syscall);
        }
        else{
          console.log('populating prediction Successful ', body);
        };
  });
};
