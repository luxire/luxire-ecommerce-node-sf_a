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
//var env = require('../../config/constants');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));


exports.getAllTaxons = function(req, res) {

    console.log("all taxons in v1 are calling...");
    console.log(req.query);
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
    console.log("query string in all taxons: ",qstr);
  http
    .get(constants.spree.host+constants.spree.alltaxons+"?"+qstr+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });

};
