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
  app.use('/api/country', require('./api/commonServices/country'));
  /*end*/

  /*start of Back-Office services routes*/

  /*end of Admin services*/

  /*start of Store-front services routes*/

  /*end*/

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
