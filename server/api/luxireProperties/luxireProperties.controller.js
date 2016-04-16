'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /products              ->  index
 * POST    /products              ->  create
 * GET     /products/:id          ->  show
 * PUT     /products/:id          ->  update
 * DELETE  /products/:id          ->  destroy
 */

var _ = require('lodash');
var http = require('request');
var querystring = require('querystring');
// var qs = require('qs');
var env = require('../../config/constants');
var path = require('path');
//var constants = require(path.resolve('server/api/v1/version_constants'));




exports.properties_Index = function(req, res) {
      console.log("properties index is calling..");
  http
    .get(env.spree.host+env.spree.luxireProperties+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });

};

exports.properties_byId = function(req, res) {
    console.log("properties by id is calling..");
    console.log("url: ",env.spree.host+env.spree.luxireProperties+"/"+req.params.id);
  http
    .get(env.spree.host+env.spree.luxireProperties+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };

    });

};

exports.properties_create = function(req, res) {
  console.log('style master create', req.body);
  http.post({
    uri: env.spree.host+env.spree.luxireProperties+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    };
});

};

exports.properties_update = function (req, res){
  console.log("update properties is calling..");
  console.log("url: ",env.spree.host+env.spree.luxireProperties+'/'+req.params.id);
        http
          .put({
            uri: env.spree.host+env.spree.luxireProperties+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
            headers:{'content-type': 'application/json'},
            body:JSON.stringify(req.body)
          }, function(error, response, body){
            if(error){
              res.status(500).send(error);
            }
            else{
              res.status(response.statusCode).send(body);
              console.log("Body",body);
            };
          });
  };

exports.properties_delete = function(req, res) {
  console.log("delete properties is calling..");
  console.log("url: ",env.spree.host+env.spree.luxireProperties+'/'+req.params.id);
  http
    .del(env.spree.host+env.spree.luxireProperties+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
