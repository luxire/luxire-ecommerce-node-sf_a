'use strict';

var _ = require('lodash');
var http = require('request');

// Get list of userManagers
exports.index = function(req, res) {
  res.json([]);
};

//user login / signin
exports.login = function(req, res){
  console.log('login user with id: '+req.body.user.email)
  console.log(req.connection.remoteAddress)
  req.body.userIp = req.connection.remoteAddress
  
  http.post({
    uri: "http://localhost:3000/luxire-login.json",
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    var resp = JSON.parse(body)
    console.log(resp.statusCode)
    if(resp.statusCode == 200){
      console.log('Login Successful');
      res.status(200).send({data: resp,status: 200});
    }
    else if(resp.statusCode == 401){
      console.log('Unauthorised User');
      res.status(401).send({data: resp,status: 401});
    }
  })
};
