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
    .get(env.spree.host+env.spree.taxes+'.json?'+qstr, function(error, response, body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }
  });
};



// Get list of all taxes
exports.new = function(req, res) {
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
    .get(env.spree.host+env.spree.taxes+'/new.json?'+qstr, function(error, response, body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }
  });
};


//Add a promotion
exports.create = function(req, res){
  console.log(req.body)
  http.post({
    uri: env.spree.host+env.spree.taxes+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails Server Not Responding");
    }
  })
};

//Delete a Promotion
exports.destroy = function(req, res){
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .del(env.spree.host+env.spree.taxes+'/'+req.params.id+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058', function(error, response, body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }
  });
};

//Update promotion
exports.update = function(req, res){
  console.log(req.body);
  http.put({
    uri: env.spree.host+env.spree.taxes+'/'+req.params.id+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails Server Not Responding");
    }
  })

};


//Get product details
exports.show = function(req, res){
  req.params.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
  var params = querystring.stringify(req.params);
  http
    .get(env.spree.host+env.spree.taxes+'/'+req.params.id+'.json?'+params, function(error, response, body){
      if(response){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails server not responding");
      };

  });
};
