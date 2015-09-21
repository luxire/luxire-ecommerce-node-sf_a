'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/env');

// Get list of users
exports.index = function(req, res) {
  res.json([]);
};

/** user login / signin
curl -H 'Content-Type: application/json' -d '{"user":{"email":"spree@example.com","password":"spree123"}}' -X POST http://127.0.0.1:9000/api/userManager/login
*/
exports.login = function(req, res){
  console.log('login user with id: '+req.body.user.email)
  console.log(req.connection.remoteAddress)
  req.body.userIp = req.connection.remoteAddress

  http.post({
    uri: env.store.host+env.store.users+'/login.json',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    var resp = JSON.parse(body)
    console.log(resp.statusCode)
    if(resp.statusCode == 200){
      console.log('Login Successful');
      res.status(200).send(resp);
    }
    else if(resp.statusCode == 401){
      console.log('Unauthorised User');
      res.status(401).send(resp);
    }
  })
};

/**user signup*/
exports.signup = function(req, res){
  console.log(req.body);
  http.post({
    uri: env.store.host+env.store.users+'/signup.json',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log('body'+body);
    var resp = JSON.parse(body)
    if(resp.statusCode == 201){
      console.log('New user created with ID: '+resp.user_id);
      res.status(201).send(resp);
    }
    else if(resp.statusCode == 422){
      console.log('unprocessible_entity');
      res.status(422).send(resp);
    }
    else if(resp.statusCode == 403){
      console.log('user exists');
      res.status(403).send(resp);
    }
    else{
      console.log('user creation failed');
      res.status(500).send(resp);
    }
  });


};
