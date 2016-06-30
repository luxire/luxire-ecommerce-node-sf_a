'use strict';
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /products              ->  index
 * POST    /products              ->  create
 * GET     /products/:id          ->  show
 * PUT     /products/:id          ->  update
 * DELETE  /products/:id          ->  destroy
 */

var _ = require('lodash');
var http = require('request');
var querystring = require('querystring');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');

// Get list of all products
exports.index = function(req, res) {
  var qstr = ''
  for(var x in req.query){
    if(typeof req.query[x]=='object'){
      for(var y in req.query[x]){
        qstr=qstr+x+'['+y+']='+req.query[x][y]+'&'
      }
    }
    else{
      qstr=qstr+x+'='+req.query[x]+'&'
    }
  }
  console.log(qstr);
  http
    .get({
      uri: constants.spree.host+constants.spree.adminProducts+'?'+qstr,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

//Get product by id
exports.show = function(req, res){
  http
    .get({
      uri: constants.spree.host+constants.spree.adminProducts+'/'+req.params.id,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }
      , function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

//Add a product
exports.create = function(req, res){
  http.post({
    uri: constants.spree.host+constants.spree.products,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
      http.post({
        uri: constants.redis.host+constants.redis.products+'/'+body.id,
        headers:{
          'content-type': 'application/json',
        },
        body:JSON.stringify(body)
      },function(error,response,body){
        if(error){
          console.log('error', error);
          // res.status(500).send(error.syscall);
        }
        else{
          console.log('success', body);

          // res.status(response.statusCode).send(body);
        };
      })
    };
  })
};



//Update product details of a product
exports.update = function(req, res){
  console.log(req.body);
  http.put({
    uri: constants.spree.host+constants.spree.adminProducts+'/'+req.params.id,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
      http.put({
        uri: constants.redis.host+constants.redis.products+'/'+body.id,
        headers:{
          'content-type': 'application/json',
        },
        body:JSON.stringify(body)
      },function(error,response,body){
        if(error){
          console.log('error', error);
          // res.status(500).send(error.syscall);
        }
        else{
          console.log('success', body);

          // res.status(response.statusCode).send(body);
        };
      })

    };
  })

};

//Delete a product
exports.destroy = function(req, res){
  http
    .del({
      uri: constants.redis.host+constants.redis.products+'/'+req.params.id,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        console.log('error', error);
        // res.status(500).send(error.syscall);
      }
      else{
        console.log('success', body);
        // res.status(response.statusCode).send(body);
      };
  });
  http
    .del({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

//get variants of a product
exports.productVariants = function(req, res) {
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id+'/variants',
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });
};

exports.add_variant_image = function(req, res){
  console.log('params', req.params);
  var form = new formidable.IncomingForm();
  console.log('form', form);
  form.parse(req, function(err, fields, files) {
    console.log("fields", fields);
    console.log("file object in node is: ",files.file.Filepath);
    var formDataToPost = {};
    // formDataToPost.product_id = req.params.product_id;
    // formDataToPost["image[viewable_id]"] = req.params.variant_id;
    // if(files){
    //   formDataToPost["image[attachment]"] = {
    //     value:  fs.createReadStream(files.file.Filepath),
    //     options: {
    //       filename: files.file.File.Filename,
    //       contentType: files.file.File.File.type
    //     }
    //   }
    // };
    http.post({
      uri: constants.spree.host+'/customized_images',
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']},
      formData: formDataToPost
    }, function(error, response, body){
        if(error){
          res.status(500).send(error.syscall);
        }
        else{
          res.status(response.statusCode).send(body);
        };
    });

  });

}

//TODO needs to be tested
exports.createVariants = function(req, res){
  console.log("create variants fun in node is calling...");
  console.log("variant id is: ",req.params.id);
  console.log("variant price is: ",req.body);
  http.post({
    uri: env.spree.host+env.spree.products+'/'+req.params.id+'/variants',
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};

exports.csv_import = function(req,res){
  console.log('file uploading to node...');
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log("file object in node is: ",files.file);
    console.log("file path in node is: ",files.file.path);
    console.log("file name in node is: ",files.file.name);
    var formDataToPost = {
      file: {
        value:  fs.createReadStream(files.file.path),
        options: {
          filename: files.file.name,
          contentType: files.file.type
        }
      }
    };
    http.post({
      uri: constants.spree.host+constants.spree.product_csv_import,
      timeout: 6000000,
      formData: formDataToPost},
       function (err, response, body) {
         if(err){
           res.status(500).send(err.syscall);
         }
         else{
           res.status(response.statusCode).send(body);
         };
    });
  });
}
exports.searchProduct = function(req, res){
    var query = req.query.q.name_cont;
    console.log("query string  : ",query);
    console.log("product search url is: ",constants.spree.host+constants.spree.products+'?q[name_cont]='+query);
  http
    .get({
      uri: constants.spree.host+constants.spree.products+'?q[name_cont]='+query,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }
      , function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};
