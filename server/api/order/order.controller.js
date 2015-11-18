'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.index = function(req, res){

};

/*Create a new order*/
exports.create = function(req, res){
  http.post({
    uri: env.spree.host+env.spree.orders+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(response){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding")
    }
  })

};

exports.update = function(req, res){
  console.log(req.body);
  http.put({
    uri: env.spree.host+env.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:''
  },function(error,response,body){
    console.log(body);
    if(response){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding")
    }
  })
};
