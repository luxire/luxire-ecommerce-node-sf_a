'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.getAllStandardSize = function(req, res) {
  console.log("get all function");
    http
    .get(constants.spree.host+constants.spree.standard_sizes+constants.spree.json+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        console.log("getAllStandardSize controller");
        console.log("error",error.syscall);
        res.status(500).send(error.syscall);
      }
      else{
        console.log(body);
        res.status(response.statusCode).send(body);
      };
  });

};
exports.createStandardSize  = function(req, res) {
  // logger.log("Example of  logger");

  console.log(req.body);
  http.post({
    uri: constants.spree.host+constants.spree.standard_sizes+constants.spree.json+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(error);
    if(error){
      console.log("createStandardSize controller");
      console.log("error",error.syscall);
      res.status(500).send(error.syscall);
    }
    else{
      console.log(body);
      res.status(response.statusCode).send(body);
    };
  });
};
exports.getStandardSizeById = function(req, res) {
  console.log("standard size by id is calling...");
  console.log("url: ",constants.spree.host+constants.spree.standard_sizes+"/"+req.params.id+constants.spree.json);
  http
    .get(constants.spree.host+constants.spree.standard_sizes+"/"+req.params.id+constants.spree.json+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        console.log("getStandardSizeById controller");
        res.status(500).send(error.syscall);
      }
      else{
        //console.log(body);
        res.status(response.statusCode).send(body);
      };
  });
};

exports.updateStandardSizeById = function(req, res){
  console.log("Params",req.params);
    http
      .put({
        uri: constants.spree.host+constants.spree.standard_sizes+'/'+req.params.id+constants.spree.json+'?token='+req.headers['X-Spree-Token'],
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      }, function(err, response, body){
        if(err){
          res.status(500).send(error.syscall);
        }
        else{
          console.log(body);
          res.status(response.statusCode).send(body);
        };
      });
  };

exports.deleteStandardSizeById= function(req, res) {
  http
    .del(constants.spree.host+constants.spree.standard_sizes+"/"+req.params.id+constants.spree.json+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        console.log(body);
        res.status(response.statusCode).send(body);
      };
  });
};
