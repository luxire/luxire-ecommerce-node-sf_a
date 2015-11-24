'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


/*Proceed to checkout address*/
exports.checkout_address = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'/next.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    body:''
  },function(error,response,body){
    console.error(error);
    console.log(response);
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Internal Server Error");
    }
  });
};

  /*Proceed to checkout delivery*/
  exports.checkout_delivery  = function(req, res){
    http.put({
      uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Internal Server Error");
      }
    });
  };

  /*proceed to checkout payment*/
  exports.checkout_payment  = function(req, res){
    console.log(req);
    http.put({
      uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Internal Server Error");
      }
    });

  };
