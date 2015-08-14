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
        res.sendStatus(response.statusCode).send(response.body.error);
      }
  });
};

//Add a product
exports.create = function(req, res){
  console.log(req.body.product.name)
  req.body.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  http
    .post(env.store.host+env.store.products+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058&product[name]='+req.body.product.name+'&product[price]=100&product[shipping_category_id]=1&product[total_on_hand]=10&product[price]='+req.body.product.price+'&product[master].images[0].mini_url='+req.body.product.image , function(error, response, body){
      console.log(response.statusCode);
      // if(response.statusCode == 200){
      //   console.log('Post Successfull');
      //   // res.send(body);
      // }
      // else{
      //   console.log('Could not post');
      //   // res.sendStatus(response.statusCode).send(response.body.error);
      // }
    });
};

//Get product details
exports.show = function(req, res){

};

//Update product details of a product
exports.update = function(req, res){

};

//Delete a product
exports.destroy = function(req, res){

};
