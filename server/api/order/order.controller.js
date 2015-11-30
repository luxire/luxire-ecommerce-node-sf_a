'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.index = function(req, res){

};
exports.show = function(req, res){
  console.log(req.params);
  console.log(req.body);
  http.get({
    uri: env.spree.host+env.spree.orders+'/'+req.params.number+'?order_token='+req.params.token,
    body: ''
  },function(error, response, body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding")
    };
  });
};

/*Create a blank order*/
exports.create_blank_order = function(req, res){
  http.post({
    uri: env.spree.host+env.spree.orders+'.json',
    body: '{}'
  }, function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding")
    };
  })
  // uri: env.spree.host+env.spree.orders+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',

};

/*Create a new order, with existing details about the customer*/
exports.create = function(req, res){
  http.post({
    uri: env.spree.host+env.spree.orders,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      console.log(body);
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding")
    };
  });

};

/*Update quantity of item in cart*/
/*Todo change order_number to params*/
exports.update = function(req, res){
  console.log(req.body);
  console.log(env.spree.host+env.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token);
  //localhost:3000/api/orders/R187211063/line_items/114?line_item[variant_id]=29&line_item[quantity]=4&order_token=EBCe8QS2YnLBnVUYZk37Ug
  http.put({
    uri: env.spree.host+env.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token,
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

/*Add line item to cart*/
exports.add_line_item = function(req, res){
  http.post({
    uri: env.spree.host+env.spree.orders+'/'+req.params.number+'/line_items.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(req.body)
  }, function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding")
    };
  })
};