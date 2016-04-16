/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var jwt = require('jsonwebtoken');//used to create/sign/verify token
var constants = require('./config/constants');
var redis_client = require('./config/redis');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var http = require('request');


console.log('redis client', redis_client);
module.exports = function(app) {

  // Insert routes below
  app.use('/api/userManager', require('./api/userManager'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/countries', require('./api/country'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/checkouts', require('./api/checkout'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/luxire_properties', require('./api/luxireProperties'));

  /*API with versioning namespace*/
  app.use('/api/v1', require('./api/v1'));
  /**/

  app.use('/api/shipping', require('./api/shipping'));
  app.use('/api/promotions', require('./api/promotion'));
  app.use('/api/zones', require('./api/zone'));
  app.use('/api/taxes', require('./api/tax'));
  app.use('/api/taxonomies', require('./api/taxonomie'));
  app.use('/api/luxire_stocks/validate_stocks_sku', require('./api/parentSku'));
  app.use('/api/luxire_stocks', require('./api/updateStock'));
  app.use('/api/my_account', require('./api/myAccount'));
  app.use('/api/luxire_properties.json', require('./api/luxireProperties'));
  app.use('/api/luxire_vendor_masters', require('./api/luxireVendor'));

  /*To test filteration*/
  app.get('/redis_products',function(req,res){
      client.exists("products", function(err,reply){
          if(reply===1){
          if(err)
            res.status(500).end();
          //console.log("in redis server tags is exists");
          client.get("products", function(err, result){
          res.json({"data": JSON.parse(result)});
          });
        }else{
          console.log("in redis server tags does not exists");
        }
      })
    });
  // app.use('/api/variants', require('./api/variants'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });

    var obj={
            "product":[
              {
                "id": 10,
                "name": "mugs",
                "desc": "beautifull mugs",
                "price": 100,
                "material": "Ceramic",
                "weight": "Light weight",
                "color": "blue",
                "imgurl": "http://test.luxire.com:3000/spree/products/45/mini/spree_mug.jpeg?1451992077",
                "tags": ["blue","Ceramic","Light weight"]
              },
              {
                "id": 11,
                "name": "mug Back",
                "desc": "beautifull mug Back",
                "price": 120,
                "material": "Plastic",
                "weight": "Medium weight",
                "color": "white",
                "imgurl": "http://test.luxire.com:3000/spree/products/46/mini/spree_mug_back.jpeg?1451992077",
                "tags": ["white","Plastic","Medium weight"]
              },
              {
                "id": 12,
                "name": "mug",
                "desc": "beautifull mug",
                "price": 150,
                "material": "Metalic",
                "weight": "Heavy weight",
                "color": "red",
                "imgurl": "http://test.luxire.com:3000/spree/products/27/mini/ror_mug.jpeg?1451992073",
                "tags": ["red","Metalic","Heavy weight","printed"]
              },
              {
                "id": 13,
                "name": "mug back",
                "desc": "beautifull mug back",
                "price": 200,
                "material": "Metalic",
                "weight": "Light weight",
                "color": "white",
                "imgurl": "http://test.luxire.com:3000/spree/products/28/mini/ror_mug_back.jpeg?1451992073",
                "tags": ["white","Metalic","Light weight"]
              },
              {
                "id": 14,
                "name": "bags",
                "desc": "beautifull bag",
                "price": 180,
                "material": "Cotton",
                "weight": "Medium weight",
                "color": "red",
                "imgurl": "http://test.luxire.com:3000/spree/products/21/mini/ror_tote.jpeg?1451992072",
                "tags": ["synthetic","checks","Cotton","Medium weight","red"]
              },
              {
                "id": 15,
                "name": "spree bag",
                "desc": "beautifull spree bag",
                "price": 210,
                "material": "Linen",
                "weight": "Heavy weight",
                "color": "nevyblue",
                "imgurl": "http://test.luxire.com:3000/spree/products/22/mini/ror_tote_back.jpeg?1451992072",
                "tags": ["simple","Linen","Heavy weight","nevyblue"]
              },
              {
                "id": 16,
                "name": "ringer t-shirt",
                "desc": "beautifull ringer t-shirt",
                "price": 220,
                "material": "Wool",
                "weight": "Light weight",
                "color": "white",
                "imgurl": "http://test.luxire.com:3000/spree/products/38/mini/spree_ringer_t.jpeg?1451992075",
                "tags": ["silk","checks","white","Light weight","Wool"]
              },
              {
                "id": 17,
                "name": "ringer t-shirt ",
                "desc": "beautifull ringer t-shirt back",
                "price": 250,
                "material": "Linen",
                "weight": "Light weight",
                "color": "white",
                "imgurl": "http://test.luxire.com:3000/spree/products/39/mini/spree_ringer_t_back.jpeg?1451992076",
                "tags": ["stribes","Linen","Light weight","white"]
              },
              {
                "id": 18,
                "name": " spree t-shirts",
                "desc": "beautifull t-shirts",
                "price": 230,
                "material": "Wool Flannel",
                "weight": "Medium weight",
                "color": "white",
                "imgurl": "http://test.luxire.com:3000//spree/products/47/mini/prod_img.png?1451996017",
                "tags": ["silk","checks","Wool Flannel","Medium weight","white"]
              },
              {
                "id": 19,
                "name": " red t-shirt",
                "desc": "beautifull jeans",
                "price": 240,
                "material": "Cotton",
                "weight": "Light weight",
                "color": "red",
                "imgurl": "http://test.luxire.com:3000/spree/products/29/mini/ror_ringer.jpeg?1451992073",
                "tags": ["Cotton","Light weight","red"]
              },
              {
                "id": 20,
                "name": "t-shirt",
                "desc": "beautifull punjabi",
                "price": 300,
                "material": "Wool",
                "weight": "Heavy weight",
                "color": "yellow",
                "imgurl": "http://test.luxire.com:3000/spree/products/30/mini/ror_ringer_back.jpeg?1451992074",
                "tags": ["Wool","yellow","Heavy weight","Wool"]
              },
              {
                "id": 21,
                "name": "baseball ",
                "desc": "beautifull baseball",
                "price": 300,
                "material": "Wool Flannel",
                "weight": "Light weight",
                "color": "blue",
                "imgurl": "http://test.luxire.com:3000/spree/products/24/mini/ror_baseball.jpeg?1451992073%22",
                "tags": ["blue","Wool Flannel","Light weight"]
              },
              {
                "id": 22,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 310,
                "material": "Linen",
                "weight": "Medium weight",
                "color": "blue",
                "imgurl": "http://test.luxire.com:3000/spree/products/25/mini/ror_baseball_back.jpeg?1451992073",
                "tags": ["Linen","Medium weight","blue"]
              },
              {
                "id": 23,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 320,
                "material": "Wool Flannel",
                "weight": "Heavy weight",
                "color":"red",
                "imgurl": "http://test.luxire.com:3000/spree/products/2/mini/ror_baseball_jersey_back_red.png?1451992069",
                "tags": ["Wool Flannel","Heavy weight","red"]
              },
              {
                "id": 24,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 350,
                "material": "Cotton",
                "weight": "Light weight",
                "color":"red",
                "imgurl": "http://test.luxire.com:3000/spree/products/1/mini/ror_baseball_jersey_red.png?1451992069",
                "tags": ["Cotton","Light weight","red"]
              },
              {
                "id": 25,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 280,
                "material": "Cotton",
                "weight": "Medium weight",
                "color":"blue",
                "imgurl": "http://test.luxire.com:3000/spree/products/3/mini/ror_baseball_jersey_blue.png?1451992069",
                "tags": ["Cotton","full","blue","Medium weight"]
              },
              {
                "id": 26,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 290,
                "material": "Wool",
                "weight": "Light weight",
                "color":"blue",
                "imgurl": "http://test.luxire.com:3000/spree/products/4/mini/ror_baseball_jersey_back_blue.png?1451992069",
                "tags": ["Wool","Light weight","blue"]
              },
              {
                "id": 27,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 340,
                "material": "Wool",
                "weight": "Medium weight",
                "color": "green",
                "imgurl": "http://test.luxire.com:3000/spree/products/6/mini/ror_baseball_jersey_back_green.png?1451992070",
                "tags": ["Wool","green","Medium weight"]
              },
              {
                "id": 28,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 300,
                "material": "Wool Flannel",
                "weight": "Light weight",
                "color":"red",
                "imgurl": "http://test.luxire.com:3000/spree/products/7/mini/ror_baseball_jersey_red.png?1451992070",
                "tags": ["Wool Flannel","Light weight","red"]
              },
              {
                "id": 29,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 225,
                "material": "Linen",
                "weight": "Others weight",
                "color":"red",
                "imgurl": "http://test.luxire.com:3000/spree/products/8/mini/ror_baseball_jersey_back_red.png?1451992070",
                "tags": ["Others weight","red","Linen"]
              },
              {
                "id": 30,
                "name": "t-shirt full",
                "desc": "beautifull punjabi",
                "price": 360,
                "material": "Cotton",
                "weight": "Others",
                "color":"red",
                "imgurl": "http://test.luxire.com:3000/spree/products/7/mini/ror_baseball_jersey_red.png?1451992070",
                "tags": ["Cotton","Others","red"]
              }
            ]
          }
          client.set("products", JSON.stringify(obj));



};
// app.all('/*', function (req, res, next) {
//   console.log('enabling cors..');
//   res.header("Access-Control-Allow-Origin", "*");
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//    res.header("Access-Control-Allow-Headers", "X-Requested-With");
//        next();
// });
//
// app.use(function(req, res, next) {
//   console.log('enabling cors in use..');
//
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// app.use('/api/address', require('./api/address'));
// app.use(function(req, res, next){
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//   if (token) {
//
//   // verifies secret and checks exp
//   jwt.verify(token, constants.spree.jwt_secret, function(err, decoded) {
//     if (err) {
//       return res.json({ success: false, message: 'Failed to authenticate token.' });
//     } else {
//       console.log('decoded', decoded);
//       // if everything is good, save to request for use in other routes
//       req.decoded = decoded;
//       next();
//     }
//   });
//
// } else {
//
//   // if there is no token
//   // return an error
//   return res.status(403).send({
//       success: false,
//       message: 'No token provided.'
//   });
//
// }
// });
