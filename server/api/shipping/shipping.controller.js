'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');

exports.update_stock_location = function(req, res){
  console.log(req.params);
  http.put({
    uri: env.spree.host+env.spree.stock_locations+'/'+req.params.id+'?token='+req.params.token,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};
/*Get stock locn*/
exports.get_stock_location = function(req, res){
  console.log(req.params);
  http.get({
    uri: env.spree.host+env.spree.stock_locations+'/'+req.params.id+'?token='+req.params.token,
    body:''
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};
