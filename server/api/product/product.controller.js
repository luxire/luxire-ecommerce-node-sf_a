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

exports.productVariants = function(req, res) {
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .get(env.spree.host+env.spree.products+'/'+req.params.id+'/variants?'+params, function(error, response, body){
      if(response){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      }
  });
};



// Get list of all products
exports.index = function(req, res) {
  req.query.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
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
  console.log(qstr);
  http
    .get(env.spree.host+env.spree.products+'?'+qstr, function(error, response, body){
      if(response){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };
  });
};

//Add a product
exports.create = function(req, res){
  console.log(req.body)
  http.post({
    uri: env.spree.host+env.spree.products+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(response.statusCode == 201){
      console.log(body)
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
  console.log(req);
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .get(env.spree.host+env.spree.products+'/'+req.params.id+'?'+params, function(error, response, body){
      if(response){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };

  });
};


//Update product details of a product
exports.update = function(req, res){
  console.log(req.body);
  http.put({
    uri: env.spree.host+env.spree.products+'/'+req.params.id+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
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
    .del(env.spree.host+env.spree.products+'/'+req.params.id+'?'+params, function(error, response, body){
      if(response){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };
  });









};
