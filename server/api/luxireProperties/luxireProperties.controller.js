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



exports.index = function(req, res) {
  console.log("luxire properties api is calling\n\n");

  http
    .get(env.spree.host+env.spree.luxireProperties, function(error, response, body){
      if(response){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };
  });
};
