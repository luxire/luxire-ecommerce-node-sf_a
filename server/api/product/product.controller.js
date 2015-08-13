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
var Client = require('node-rest-client').Client;
var env = require('../../config/env')
var client = new Client();
// Get list of all products
exports.index = function(req, res) {
  client.get(env.store.host+env.store.products+'/1000?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',function(data, response){
    res.send(response.statusCode);
  })
};

//Add a product
exports.create = function(req, res){

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
