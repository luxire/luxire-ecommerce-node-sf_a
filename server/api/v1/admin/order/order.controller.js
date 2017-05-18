'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.index = function(req, res){
  var query = "";
  for (var query_param in req.query){
    if(query_param !== "page"){
      query = query + "q["+query_param +"]="+req.query[query_param]+"&";
    }
    else{
      query = query + query_param +"="+req.query[query_param]+"&";
    }
  }
  http.get({
    uri: constants.spree.host+constants.spree.orders+"?token="+req.headers['X-Spree-Token']+"&"+query,
    body: ''
  },function(error, response, body){
    if(error){
      res.status(500).send(error)
    }
    else{
      res.send(body);
    };
  });
};
exports.show = function(req, res){
  http.get({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'?token='+req.headers['X-Spree-Token'],
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
/*Update status*/
exports.update_status = function(req, res){
  http.put({
    uri: constants.spree.host+'/api/change_order_status?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send("Rails server not responding");
    }
    else{
      res.status(response.statusCode).send(body);
    }
  })
};

/*Update line item status*/
exports.update_line_item_status = function(req, res){
  http.put({
    uri: constants.spree.host+'/api/change_line_item_status?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    }
  })
};


exports.cancel = function(req, res){
  http.put({
    uri: constants.spree.host+'/api/orders/' + req.params.id + '/cancel' + '?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'}, 
    body: JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    }
  })
};

exports.ship = function(req, res){
  http.put({
    uri: constants.spree.host+'/api/shipments/' + req.params.id + '/ship.json' + '?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'}
  },function(error,response,body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    }
  })
};


exports.refund = function(req, res){
  http.put({
    uri: constants.spree.host+'/api/custom_refund/refund/?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    }
  })
};




