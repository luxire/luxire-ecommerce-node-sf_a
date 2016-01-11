'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');

exports.update_stock_location = function(req, res){
  console.log(req.params);
  http.put({
    uri: env.spree.host+env.spree.stock_locations+'/'+req.params.id+'?token='+req.params.token,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};
/*Get stock locn*/
exports.get_stock_location = function(req, res){
  console.log(req.params);
  http.get({
    uri: env.spree.host+env.spree.stock_locations+'/'+req.params.id+'?token='+req.params.token,
    body:''
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};
/*Get carrier details*/
exports.get_carrier_details = function(req, res){
  http.get({
    uri: env.spree.host+env.spree.carriers+'/show?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    body:''
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};
/*Update carrier details*/
exports.update_carrier_details = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.carriers+'/update?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};

exports.index_shipping_method = function(req, res){
  http.get({
    uri: env.spree.host+env.spree.shipping_methods+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
    },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};

exports.new_shipping_method = function(req, res){
  http.get({
    uri: env.spree.host+env.spree.shipping_methods+'/new.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
    },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};

exports.create_shipping_method = function(req, res){
  console.log(req.body);
  http.post({
    uri: env.spree.host+env.spree.shipping_methods+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
    },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Rails server not responding");
    }
  })
};

exports.destroy_shipping_method = function(req, res){
  http
    .del(env.spree.host+env.spree.shipping_methods+'/'+req.params.id+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058', function(error, response, body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }
  });
};

//todo update
