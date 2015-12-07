/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/userManager', require('./api/userManager'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/things', require('./api/thing'));
  // app.use('/api/address', require('./api/address'));
  /*start of common services routes*/

  app.use('/api/countries', require('./api/country'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/checkouts', require('./api/checkout'));
  app.use('/api/shipping', require('./api/shipping'));
  // app.use('/api/variants', require('./api/variants'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
