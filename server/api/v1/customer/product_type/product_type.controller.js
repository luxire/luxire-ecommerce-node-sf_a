'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.getAllProductType = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058", function(error, response, body){
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
    .get(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058", function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};
