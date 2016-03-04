'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');


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
  console.log('params', req.params);
  var form = new formidable.IncomingForm();
  console.log('form', form);
  form.parse(req, function(err, fields, files) {
    console.log("fields", fields);
    console.log("file object in node is: ",files);
    var formDataToPost = {};
    for (var key in fields){
      console.log('key', key);
      console.log('value', JSON.stringify(fields[key]));
      formDataToPost[key] = JSON.stringify(fields[key]);
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
    http
      .post({
        uri: constants.spree.host+constants.spree.style_masters+'?token='+req.headers['X-Spree-Token'],
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
//   http.post({
//     uri: constants.spree.host+constants.spree.style_masters+'?token='+req.headers['X-Spree-Token'],
//     headers:{'content-type': 'application/json'},
//     body:JSON.stringify(req.body)
//   },function(error,response,body){
//     if(error){
//       res.status(500).send(error);
//     }
//     else{
//       res.status(response.statusCode).send(body);
//     };
// });

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
  console.log('params', req.params);
  var form = new formidable.IncomingForm();
  console.log('form', form);
  form.parse(req, function(err, fields, files) {
    console.log("fields", fields);
    console.log("file object in node is: ",files);
    var formDataToPost = {};
    for (var key in fields){
      console.log('key', key);
      console.log('value', JSON.stringify(fields[key]));
      formDataToPost[key] = JSON.stringify(fields[key]);
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
    http
      .put({
        uri: constants.spree.host+constants.spree.style_masters+'/'+req.params.id+'?token='+req.headers['X-Spree-Token'],
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
