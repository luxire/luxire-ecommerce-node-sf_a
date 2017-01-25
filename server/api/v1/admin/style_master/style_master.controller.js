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
  console.log('style master create', req.body);
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
  console.log('req body in update', req.body);
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
              console.log("Body",body);
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





/*Utility to update image of style master*/
exports.update_image = function(req, res){
  console.log("req params:",req.params);
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

exports.create_style_detail_image = function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var formDataToPost = {};
    formDataToPost["luxire_style_master_image[category]"] = fields["category"];
    formDataToPost["luxire_style_master_image[luxire_style_master_id]"] = fields["luxire_style_master_id"];
    if(files && files.image){
      formDataToPost["luxire_style_master_image[image]"] = {
        value:  fs.createReadStream(files.image.path),
        options: {
          filename: files.image.name,
          contentType: files.image.type
        }
      }
    };
    http
    .post({
      uri: constants.spree.host+constants.spree.style_master_images+'.json?token='+req.headers['X-Spree-Token'],
      formData: formDataToPost
      }, function(error, response, body){
        if(error){
          console.log('error', error);
          res.status(500).send(error);
        }
        else{
          console.log('body', body);
          res.status(response.statusCode).send(body);
        };
      });
  });
};

exports.delete_style_detail_image = function(req, res){
  http
  .del({
    uri: constants.spree.host+constants.spree.style_master_images+'/'+req.params.image_id+'.json?token='+req.headers['X-Spree-Token'],
    }, function(error, response, body){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });
};

/*----------*/
