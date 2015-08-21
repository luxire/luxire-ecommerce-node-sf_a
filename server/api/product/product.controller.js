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
var env = require('../../config/env');
// Get list of all products
exports.index = function(req, res) {
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .get(env.store.host+env.store.products+'?'+params, function(error, response, body){
      if(response.statusCode == 200){
        res.send(body);
      }
      else{
        res.status(response.statusCode).send(response.body.error);
      }
  });
};

//Add a product
exports.create = function(req, res){
  console.log(req.body)
  console.log(req.body.product.master.images[0])
  http.post({
    uri: env.store.host+env.store.products+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(response.statusCode == 201){
      res.send({data: body,status: 201});
    }
    else{
      console.log('Could not post');
      res.status(response.statusCode).send(response.body.error);
    }
  })
};

//Get product details
exports.show = function(req, res){
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .get(env.store.host+env.store.products+'/'+req.params.id+'?'+params, function(error, response, body){
      if(response.statusCode == 200){
        res.send(body);
      }
      else{
        res.status(response.statusCode).send(response.body.error);
      }
  });
};

//Update product details of a product
exports.update = function(req, res){
  console.log(req.body);
  http.put({
    uri: env.store.host+env.store.products+'/'+req.params.id+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(response.statusCode == 200){
      res.send({data: body,status: 200});
    }
    else{
      console.log('Could not post');
      res.status(response.statusCode).send(response.body.error);
    }
  })

};

//Delete a product
exports.destroy = function(req, res){
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .del(env.store.host+env.store.products+'/'+req.params.id+'?'+params, function(error, response, body){
      if(response.statusCode == 204){
        res.status(response.statusCode).send('Deleted');
      }
      else{
        res.status(response.statusCode).send(response.body.error);
      }
  });


};
