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
var prediction = require(path.resolve('server/api/v1/generic/prediction/prediction.controller'));


/*****
Products
******/
// Get list of all products
exports.index = function(req, res) {
  var spree_cookie = [];
  console.log('req to search', req.query);
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
      uri: constants.spree.host+constants.spree.products+'?'+qstr,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        spree_cookie = response.headers['set-cookie'][0].split(';');
        if(req.cookies.guest_token == undefined || req.cookies.guest_token == null){
          res.cookie('guest_token', spree_cookie[0].split('=')[1],{expires: new Date(spree_cookie[2].split('=')[1])});
        }
        res.status(response.statusCode).send(body);
      };
  });
};

//Search from redis for products

exports.search = function(req, res) {
  console.log('search by name ', req.query, 'body',req.body);
  var request = req.query || {};
  for (var property in req.body){
    request[property] = req.body[property];
  }
  // if(req.query && req.query.name_cont){
  //   if(typeof request === 'object'){
  //     request['name'] = req.query.name_cont;
  //   }
  //   else{
  //     request = {
  //       name: req.query.name_cont
  //     }
  //   }
  // }
  http
    .post({
      uri: constants.redis.host+constants.redis.search.products,
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(request)
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
      uri: constants.spree.host+constants.spree.products+'/'+req.params.id,
      headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
    }
    , function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        prediction.create({
          "event" : "view",
          "entityType" : "user",
          "entityId" : "1",       //need to change for guest user
          "targetEntityType" : "item",
          "targetEntityId" : JSON.parse(body).id //need to change as user may pass slug
        });
        res.status(response.statusCode).send(body);
      };
  });
};
// exports.show = function(req, res){
//   console.log('req params', req.params);
//   console.log('req cookies', req.cookies.guest_token);
//   http
//     .get({
//       uri: constants.redis.host+'/api/redis/v1/products/'+req.params.id,
//     }
//       , function(error, response, body){
//         if(error){
//           res.status(500).send(error.syscall);
//           console.log('response from redis failed', error);
//         }
//         else{
//           prediction.create({
//             "event" : "view",
//             "entityType" : "user",
//             "entityId" : "1",       //need to change for guest user
//             "targetEntityType" : "item",
//             "targetEntityId" : JSON.parse(body).id //need to change as user may pass slug
//           });
//           res.status(response.statusCode).send(body);
//         };
//   });
// };

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

/*Taxonomy*/

exports.taxonomy_index = function(req, res){
  var spree_cookie = [];
  http
    .get(constants.spree.host+constants.spree.taxonomy, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
        console.log('failed to fetch taxonomies', error);
      }
      else{
        if(req.cookies.guest_token == undefined || req.cookies.guest_token == null){
          for(var i=0; i<response.headers['set-cookie'].length; i++){
            spree_cookie = response.headers['set-cookie'][i].split(';');
            if(spree_cookie[0].split('=')[0]==='guest_token'){
              res.cookie('guest_token', spree_cookie[0].split('=')[1],{expires: new Date(spree_cookie[2].split('=')[1])});
            }
          }
        }
        console.log('collection response code', response.statusCode);
        res.status(response.statusCode).send(body);
      };
  });
};
var conv_to_query = function(filters){
  var query_str = "";
  for(var key in filters){
    query_str = query_str === ""? query_str+key+'='+filters[key] : query_str+'&'+key+'='+filters[key];
  }
  return query_str;
}
exports.collections = function(req, res){
  console.log('req body in collection', req.body);
  http
    .get(constants.redis.host+constants.redis.collections+'?'+conv_to_query(req.body), function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        console.log('collection response', body);
        res.status(response.statusCode).send(body);
      };
  });

  /*fetch collection without redis*/
  // http
  //   .get(constants.spree.host+constants.spree.collections+'?permalink='+req.query.permalink, function(error, response, body){
  //     if(error){
  //       res.status(500).send(error.syscall);
  //     }
  //     else{
  //       if(req.cookies.guest_token == undefined || req.cookies.guest_token == null){
  //         for(var i=0; i<response.headers['set-cookie'].length; i++){
  //           spree_cookie = response.headers['set-cookie'][i].split(';');
  //           if(spree_cookie[0].split('=')[0]==='guest_token'){
  //             res.cookie('guest_token', spree_cookie[0].split('=')[1],{expires: new Date(spree_cookie[2].split('=')[1])});
  //           }
  //         }
  //       }
  //       console.log('collection response code', response.statusCode);
  //       res.status(response.statusCode).send(body);
  //     };
  // });
};


exports.taxonomy_show = function(req, res){
  http
    .get(constants.spree.host+constants.spree.taxonomy+'/'+req.params.taxonomy_id+'/taxons', function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
  });
};

exports.taxon_show = function(req, res) {
    http
      .get(constants.spree.host+constants.spree.taxonomy+'/'+req.params.taxonomy_id+'/taxons/'+req.params.taxon_id, function(error, response, body){
        if(error){
          res.status(500).send(error.syscall);
        }
        else{
          res.status(response.statusCode).send(body);
        };
    });
};

exports.properties_index = function(req, res){
  console.log('filter/properties');
  http
  .get(constants.spree.host+constants.spree.luxireProperties, function(error, response, body){
    if(error){
      res.status(500).send(error);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });

};

exports.custom_image_upload = function(req, res){
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

}

exports.recommended = function(req, res){
  console.log(req.body);
  var sample_ids = constants.prediction.sample_product_ids;
  var exp_response_length = constants.prediction.expected_res_len;
  console.log('ref id', req.body.ref_id);
  console.log('customer_bought', constants.prediction.host+constants.prediction.customer_bought);
  var recommended_product_ids = [];
  var prediction_response = {};
  http.post({
    uri: constants.prediction.host+constants.prediction.customer_bought,
    body: JSON.stringify({items: [req.body.ref_id], num: 5}),
    rejectUnauthorized: false,
      requestCert: true,
      agent: false,
  },function(error, response, body){
    recommended_product_ids = [];
    if(error){
      console.log('error', error);
      res.status(500).send(error.syscall);
    }
    else{
      prediction_response = JSON.parse(body);
      console.log('prediction response', prediction_response);
      if(body && prediction_response && prediction_response.itemScores.length){
        for(var i=0;i<prediction_response.itemScores.length&&i<exp_response_length;i++){
          recommended_product_ids.push(parseInt(prediction_response.itemScores[i].item));
        }
      }
      console.log('recommended product ids length',recommended_product_ids.length, 'exp len', exp_response_length);
      if(recommended_product_ids.length<exp_response_length){
        var i=0;
        while(recommended_product_ids.length<exp_response_length){
          if(recommended_product_ids.indexOf(sample_ids[i])==-1){
            recommended_product_ids.push(sample_ids[i]);
          }
          i++;
        }
      }
      console.log('recommended products req', constants.redis.host+constants.redis.products+'?ids=['+recommended_product_ids+']');
      http
        .get({
          uri: constants.redis.host+constants.redis.products+'?ids=['+recommended_product_ids+']',
        }, function(error, response, body){
          if(error){
            res.status(500).send(error.syscall);
          }
          else{
            console.log('response from redis', body);
            res.status(response.statusCode).send(body);
          };
        });

    };
  });
};

exports.apply_filters = function(req, res){
  console.log('req body', req.body);
  console.log('req query', req.query);
  console.log('query str', conv_to_query(req.body));
  http.post({
    uri: constants.redis.host+constants.redis.products_filter+'?'+conv_to_query(req.body),
    headers:{
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: conv_to_query(req.body)
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      console.log('redis res', body);
      res.status(response.statusCode).send(body);
    };
  });
}
