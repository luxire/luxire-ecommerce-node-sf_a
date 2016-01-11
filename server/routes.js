/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {
  app.all('/*', function (req, res, next) {
    console.log('enabling cors..');
    res.header("Access-Control-Allow-Origin", "*");
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
         next();
  });

  app.use(function(req, res, next) {
    console.log('enabling cors in use..');

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
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
  app.use('/api/promotions', require('./api/promotion'));
  app.use('/api/zones', require('./api/zone'));
  app.use('/api/taxes', require('./api/tax'));
  app.use('/api/taxonomies', require('./api/taxonomie'));

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
