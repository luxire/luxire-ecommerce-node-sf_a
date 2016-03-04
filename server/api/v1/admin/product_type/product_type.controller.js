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
  console.log('file uploading to node...');
  var form = new formidable.IncomingForm();
  var data;
  console.log('form', form);
  form.parse(req, function(err, fields, files) {
    console.log("fields", fields);
    console.log("file object in node is: ",files);
    console.log("files", files.image);
    var formDataToPost = {};
    formDataToPost.product_type = fields.product_type || '';
    formDataToPost.description = fields.description || '';
    formDataToPost.measurement_type_ids = fields.measurement_type_ids || '';
    if(files && files.image){
      formDataToPost.image = {
        value:  fs.createReadStream(files.image.path),
        options: {
          filename: files.image.name,
          contentType: files.image.type
        }
      }

    }
    http.put({
      uri: constants.spree.host+constants.spree.product_types+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
      formData: formDataToPost
     }, function (err, response, body) {
       if(err){
         res.status(500).send(error.syscall);
       }
       else{
         res.status(response.statusCode).send(body);
       };
    });
  })
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
