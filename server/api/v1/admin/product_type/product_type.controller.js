'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');


exports.getAllProductType = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
exports.createProductType = function(req, res) {
  console.log(req.body);
  http.post({
    uri: constants.spree.host+constants.spree.product_types+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(error);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

exports.getProductTypeById = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

exports.editProductTypeById= function(req, res) {
  http
    .get(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"/edit?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.productTypesShowById= function(req, res) {
  http
    .patch(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.updateProductTypeById = function(req, res){
  console.log("Params",req.params);
    http
      .put({
        uri: constants.spree.host+constants.spree.product_types+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      }, function(err, response, body){
        if(err){
          res.status(500).send(error.syscall);
        }
        else{
          res.status(response.statusCode).send(body);
        };
      });
  };

exports.deleteProductTypeById= function(req, res) {
  http
    .del(constants.spree.host+constants.spree.product_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};
/*Utility to update image of style master*/
exports.update_image = function(req, res){
  console.log("req params:",req.params);
  // console.log('request to update image', req.params.id);
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    // console.log("fields", fields);
    console.log("file object in node is: ",files);
    var formDataToPost = {};
    for (var key in fields){
      // console.log('key', key);
      // console.log('value', fields[key]);
      formDataToPost[key] = fields[key];
    }
    if(files && files.image){
      formDataToPost.image = {
        value:  fs.createReadStream(files.image.path),
        options: {
          filename: files.image.name,
          contentType: files.image.type
        }
      }
    };
    console.log('formDataToPost', formDataToPost);
    http
      .put({
      uri: constants.spree.host+constants.spree.product_types+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
        formData: formDataToPost
      }, function(error, response, body){
        if(error){
          res.status(500).send(error);
        }
        else{
          res.status(response.statusCode).send(body);
        };
      });
  });

};
