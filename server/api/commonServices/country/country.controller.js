'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../../config/constants');

/** Fetch countries
curl -X GET http://127.0.0.1:9000/api/addresses/countries
*/
exports.index = function(req, res){
  http.get({
    uri: env.spree.host+env.spree.countries+'/all',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(body !== undefined){
      var resp = JSON.parse(body);
      res.status(201).send(resp);
    }
    else{
      res.status(500).send("rails server not responding");
    }
  })
};
