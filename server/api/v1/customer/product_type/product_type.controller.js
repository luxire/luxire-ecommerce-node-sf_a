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

exports.standard_sizes =  function(req, res){
  console.log('std sizes parms',req.query);
  var fit_type = req.query.fit_type+' Fit';
  var neck = req.query.neck_size;
  var shirt_length = req.query.shirt_length;
  console.log(constants.spree.host+"/get_standard_size?token="+req.headers['X-Spree-Token']+'&fit_type='+fit_type+'&neck='+neck+'&shirt_length='+shirt_length);
  http
    .get(constants.spree.host+"/get_standard_size?"+'&fit_type='+fit_type+'%20Fit&neck='+neck+'&shirt_length='+shirt_length,
     function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        console.log(body);
        res.status(response.statusCode).send(body);
      };
  });
};
