'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.getAllProductType = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
exports.createProductType = function(req, res) {
  http.post({
    uri: constants.spree.host+constants.spree.product_types+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(error);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

exports.getProductTypeById = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

exports.editProductTypeById= function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"/edit?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.productTypesShowById= function(req, res) {
  http
    .patch(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.updateProductTypeById = function(req, res){
  http.put({
    uri: constants.spree.host+constants.spree.product_types+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })

};

exports.deleteProductTypeById= function(req, res) {
  http
    .del(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
