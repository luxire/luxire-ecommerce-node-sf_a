'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.index = function(req, res){
  http
    .get({
    uri: env.spree.host+env.spree.countries+'/all.json',
    headers:{'content-type': 'application/json'},
    body:''
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails Server Not Responding");
    }

    });
  };

  exports.search = function(req, res){
    console.log(req.query);
    req.query.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
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
    http.get(env.spree.host+env.spree.countries+'?'+qstr,function(error, response, body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }
    });
  }
