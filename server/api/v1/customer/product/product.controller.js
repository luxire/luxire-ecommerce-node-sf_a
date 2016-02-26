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
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

/*****
Products
******/
// Get list of all products
var spree_cookie = [];
exports.index = function(req, res) {
  var qstr = ''
  for(var x in req.query){
    if(typeof req.query[x]=='object'){
      for(var y in req.query[x]){
        qstr=qstr+x+'['+y+']='+req.query[x][y]+'&'
      }
    }
    else{
      qstr=qstr+x+'='+req.query[x]+'&'
    }
  }
  console.log(qstr);
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'?'+qstr
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        if(req.cookies.guest_token == undefined || req.cookies.guest_token == null){
          res.cookie('guest_token', spree_cookie[0].split('=')[1],{expires: new Date(spree_cookie[2].split('=')[1])});
        }
        spree_cookie = response.headers['set-cookie'][0].split(';');
        res.status(response.statusCode).send(body);
      };
  });
};

//Get product by id
exports.show = function(req, res){
  console.log('req params', req.params);
  http.cookie('guest_token='+req.cookies.guest_token);
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id
    }
      , function(error, response, body){
        if(error){
          res.status(500).send(error.syscall);
        }
        else{
          if(req.cookies.guest_token == undefined || req.cookies.guest_token == null){
            res.cookie('guest_token', spree_cookie[0].split('=')[1],{expires: new Date(spree_cookie[2].split('=')[1])});
          }
          spree_cookie = response.headers['set-cookie'][0].split(';');
          res.status(response.statusCode).send(body);
        };
  });
};

//get variants of a product
exports.productVariants = function(req, res) {
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id+'/variants'
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });
};
