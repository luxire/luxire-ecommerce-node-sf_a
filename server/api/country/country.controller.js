'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.index = function(req, res){
  http
    .get({
    uri: env.spree.host+env.spree.countries+'/all.json',
    headers:{'content-type': 'application/json'},
    body:''
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails Server Not Responding");
    }

  });

};
