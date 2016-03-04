'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');


exports.getAllMeasurementType = function(req, res) {
  console.log('get all measurementType');
  http
    .get(constants.spree.host+constants.spree.measurement_types+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });

};

exports.getMeasurementTypeById = function(req, res) {
  http
    .get(constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };

    });

};
exports.createMeasurementType = function(req, res){
      http.post({
        uri: constants.spree.host+constants.spree.measurement_types+'?token='+req.headers['X-Spree-Token'],
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      },function(error,response,body){
        if(error){
          res.status(500).send(error.syscall);
        }
        else{
          res.status(response.statusCode).send(body);
        };

    });
  };

exports.patchMeasurementTypeById = function(req, res){
  console.log(req.body);
  http.patch({
    uri: constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
}

exports.updateMeasurementTypeById = function(req, res){
  http.put({
    uri: constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+'?token='+req.headers['X-Spree-Token'],
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };

  });
};

exports.deleteMeasurementType= function(req, res) {
  console.log(req.params);
  http
    .del(constants.spree.host+constants.spree.measurement_types+"/"+req.params.id+"?token="+req.headers['X-Spree-Token'], function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
}

exports.add_image = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log("fields", fields);
    console.log("file object in node is: ",files);
    var formDataToPost = {};
    for (var key in fields){
      console.log('key', key);
      console.log('value', fields[key]);
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
    http
      .post({
        uri: constants.spree.host+'/custom_images?token='+req.headers['X-Spree-Token'],
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
