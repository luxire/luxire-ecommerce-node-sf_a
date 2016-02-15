'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.styleMastersIndex = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.style_masters+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });

};

exports.getStyleMastersById = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.style_masters+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };

  });

};
exports.styleMastersCreate = function(req, res) {
  http.post({
    uri: constants.spree.host+constants.spree.style_masters+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    };
});

};

exports.styleMastersNew = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.style_masters+"/new?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.styleMastersEditById = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.style_masters+"/"+styleMastersEditId+"/edit?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.styleMastersShowById = function(req, res) {
  var styleMastersShowId='';
  http
    .patch(constants.spree.host+constants.spree.style_masters+"/"+styleMastersShowId+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
exports.styleMastersUpdateById = function (req, res){
        http
          .put({
            uri: constants.spree.host+constants.spree.style_masters+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
            headers:{'content-type': 'application/json'},
            body:JSON.stringify(req.body)
          }, function(error, response, body){
            if(error){
              res.status(500).send(error);
            }
            else{
              res.status(response.statusCode).send(body);
            };
          });
  };


exports.styleMastersDeleteById = function(req, res) {
  var styleMastersDeleteId='';
  http
    .del(constants.spree.host+constants.spree.style_masters+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
