'use strict';

var _ = require('lodash');
var http = require('request');

// Get list of userManagers
exports.index = function(req, res) {
  res.json([]);
};

//user login / signin
exports.login = function(req, res){
  console.log(req.body)
  http.post({
    uri: "http://54.169.41.36:3000/login",
    headers:{'content-type': 'application/json'},
    body:JSON.stringify({user: {email: 'mudassir@azureiken.com',password: 'Azureiken123'}})

    // body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log(response.statusCode)
    // if(response.statusCode == 201){
    //   res.send({data: body,status: 201});
    // }
    // else{
    //   console.log('Could not post');
    //   res.status(response.statusCode).send(response.body.error);
    // }
  })
};
