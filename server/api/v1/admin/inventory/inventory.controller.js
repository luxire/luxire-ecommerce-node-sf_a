'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.updateStock = function (req, res){
  http
    .put({
      uri: constants.spree.host+constants.spree.luxire_stock+"/"+req.params.id+'?token='+req.headers['X-Spree-Token'],
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    }, function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      }
    });
};

exports.luxireStocks_index = function(req, res) {
  let per_page = req.query.per_page || 25
  let page_count = req.query.page_count || 1
  http
    .get(constants.spree.host+constants.spree.luxire_stock+"?token="+req.headers['X-Spree-Token']+'&per_page='+per_page+'&page_count='+page_count, function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      }
  });

};
exports.luxireStocks_byId = function(req, res) {
    http
      .get(constants.spree.host+constants.spree.luxire_stock+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'], function(error, response, body){
        if(error){
          res.status(500).send(error);
        }
        else{
          res.status(response.statusCode).send(body);
        }
    });

};


exports.luxireStocks_addQuantity= function(req, res){
    http.post({
      uri: constants.spree.host+constants.spree.luxire_stock+'/add_stocks?token='+req.headers['X-Spree-Token'],
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      }
  });
};

exports.luxireStocks_setQuantity = function(req, res){
      http.post({
        uri: constants.spree.host+constants.spree.luxire_stock+'/set_stocks?token='+req.headers['X-Spree-Token'],
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      },function(error,response,body){
        if(error){
          res.status(500).send(error);
        }
        else{
          res.status(response.statusCode).send(body);
        }
    });
  };

 exports.createInventory = function(req,res){
   http.post({
     uri: `${constants.spree.host}${constants.spree.luxire_stock}`,
     headers:{'content-type': 'application/json', 'X-Spree-Token': req.headers['X-Spree-Token']},
     body:JSON.stringify(req.body)
   }, function(error, response, body){
      if(error){
          res.status(response.statusCode).send(error);
        }
        else{
          res.status(response.statusCode).send(body);
        }
   })
 }

        
