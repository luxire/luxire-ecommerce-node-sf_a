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

// Get list of all products
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
      uri: constants.spree.host+constants.spree.products+'?'+qstr,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

//Get product by id
exports.show = function(req, res){
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }
      , function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

//Add a product
exports.create = function(req, res){
  http.post({
    uri: constants.spree.host+constants.spree.products,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
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



//Update product details of a product
exports.update = function(req, res){
  console.log(req.body);
  http.put({
    uri: constants.spree.host+constants.spree.products+'/'+req.params.id,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })

};

//Delete a product
exports.destroy = function(req, res){
  http
    .del({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

//get variants of a product
exports.productVariants = function(req, res) {
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id+'/variants',
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });
};
