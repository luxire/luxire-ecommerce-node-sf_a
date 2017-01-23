/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var jwt = require('jsonwebtoken');//used to create/sign/verify token
var constants = require('./config/constants');
// var redis_client = require('./config/redis');
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');
var http = require('request');


// console.log('redis client', redis_client);
module.exports = function(app) {

  /*API with versioning namespace*/
  app.use('/api/v1', require('./api/v1'));
  /**/
  // Insert routes below
  app.use('/api/userManager', require('./api/userManager'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/countries', require('./api/country'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/luxire_properties', require('./api/luxireProperties'));


  app.use('/api/shipping', require('./api/shipping'));
  app.use('/api/promotions', require('./api/promotion'));
  app.use('/api/zones', require('./api/zone'));
  app.use('/api/taxes', require('./api/tax'));
  app.use('/api/taxonomies', require('./api/taxonomie'));
  app.use('/api/luxire_stocks/validate_stocks_sku', require('./api/parentSku'));
  app.use('/api/my_account', require('./api/myAccount'));
  app.use('/api/luxire_properties.json', require('./api/luxireProperties'));
  app.use('/api/luxire_vendor_masters', require('./api/luxireVendor'));


  // app.use('/api/things', require('./api/thing'));
  // app.use('/api/orders', require('./api/order'));
  // app.use('/api/checkouts', require('./api/checkout'));
  // app.use('/api/luxire_stocks', require('./api/updateStock'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });


};
