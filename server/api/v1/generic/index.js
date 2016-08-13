/*Routing for admin api's*/
var express = require('express');
var jwt = require('jsonwebtoken');//used to create/sign/verify token
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var app = express();

app.on('mount', function(parent){
  console.log('Generic mounted');
})
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
  if (token && token!=='') {
  // verifies secret and checks exp
    jwt.verify(token, constants.spree.jwt_secret, function(err, decoded) {
      if (err) {
        return res.status(401).json({ error: 'Failed to authenticate token.' });
      }
      else {
        if(decoded.spree_api_key != undefined && decoded.spree_api_key != null && decoded.spree_api_key != ''){
          req.headers["X-Spree-Token"] = decoded.spree_api_key;
          console.log('request from user with: ', req.headers["X-Spree-Token"]);
          next();
        }
        else{
          return res.status(401).json({ error: 'Failed to authenticate token.' });
        }
      }


  });

  }
  else{
    req.headers["X-Spree-Token"] = undefined;
    next();
  }

});

// app.use('/auth', require('./auth'));
app.use('/location', require('./location'));
app.use('/prediction', require('./prediction'));

module.exports = app;
