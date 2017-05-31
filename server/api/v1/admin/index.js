/*Routing for admin api's*/
var express = require('express');
var jwt = require('jsonwebtoken');//used to create/sign/verify token
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var app = express();
console.log('admin index', Date.now());

app.on('mount', function(parent){
  console.log('admin mounted');
})
// eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJzcHJlZUBleGFtcGxlLmNvbSIsInNwcmVlX2FwaV9rZXkiOiI5OWRhMTUwNjllZjZiMzg5NTJhYTczZDQ1NTBkODhkZDI2NmZjMzAyYTRjOGIwNTgiLCJzcHJlZV9yb2xlcyI6W3siaWQiOjEsIm5hbWUiOiJhZG1pbiJ9XX0.yV7D7UIKTzcPOPz0BK2vOuiexzY78Ktj_vX_HuE-pUY
app.use(function(req, res, next){
  var token = '';
  if(req.body.token){
    token = req.body.token;
    delete req.body.token;
  }
  else if(req.query.token){
    token = req.query.token;
    delete req.query.token;
  }
  else if(req.headers['x-luxire-token']){
    token = req.headers['x-luxire-token'];
    delete req.headers['x-luxire-token'];
  }
  if (token) {
    if(token.indexOf('.') == -1){
      req.headers["X-Spree-Token"] = token;
      next();

    }
    else{//for jwt
      // verifies secret and checks exp
      jwt.verify(token, constants.spree.jwt_secret, function(err, decoded) {
        if (err) {
          return res.status(401).json({ error: 'Failed to authenticate token.' });
        } else {
          console.log('decoded spree token', decoded.spree_api_key);
          if(decoded.spree_api_key != undefined && decoded.spree_api_key != null){
            req.headers["X-Spree-Token"] = decoded.spree_api_key;
            next();
          }
          else{
            return res.status(401).json({ error: 'Failed to authenticate token.' });
          }
        }
      });
    }


  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": "No token provided."  });
    }
  });

/*product*/
app.use('/products', require('./product'));
app.use('/measurement_types', require('./measurement_type'));
app.use('/product_types', require('./product_type'));
app.use('/style_masters', require('./style_master'));
app.use('/allTaxons', require('./allTaxons'));
app.use('/standard_size', require('./standard_size'));
/*order*/
app.use('/orders', require('./order'));

/*Stock/inventory*/
app.use('/inventory', require('./inventory'));
app.use('/taxonomies', require('./taxonomies'));
app.use('/image', require('./image'));





module.exports = app;
