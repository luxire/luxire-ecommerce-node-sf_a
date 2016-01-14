'use strict';

var _ = require('lodash');
var http = require('request');
var jwt = require('jsonwebtoken');//used to create/sign/verify token
var env = require('../../config/constants');
var luxire_secret = env.spree.jwt_secret;

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
    uri: env.spree.host+env.spree.users+'/login.json',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){

    if(error == null){
      console.log(JSON.parse(body).statusCode);
      if(JSON.parse(body).statusCode == undefined) {
        console.log('luxire-secret', luxire_secret);
        var token = jwt.sign(body, luxire_secret, {
          expiresInMinutes: 1440 // expires in 24 hours
        });
        console.log('token', token);
        res.status(response.statusCode).send(token);

      }
      else{
        res.status(401).send("Invalid userId or password");
      }
    }
    else{
      res.status(500).send("Rails server not responding");
    }

  })
};

/**user signup
curl : curl -H 'Content-Type: application/json' -d '{"user":{"email":"spree@example1123234.com","password":"spree123","password_confirmation":"spree123"}}' -X POST http://127.0.0.1:9000/api/userManager/signup
*/
exports.signup = function(req, res){
  console.log(req.body);
  http.post({
    uri: env.spree.host+env.spree.users+'/signup.json',
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    console.log('body'+body);
    if(body !== undefined){
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
    }
    else{
      res.status(500).send("rails server not responding");
    }
  });
};

  /*User deletion
  curl -X DELETE http://127.0.0.1:9000/api/userManager/delete/72
  */
  exports.delete = function(req, res){
    console.log(req.params.id)
    http.del({
      uri: env.spree.host+env.spree.users+'/'+req.params.id+'.json',
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      if(body !== undefined){
        var resp = JSON.parse(body)
        console.log('resp'+resp.statusCode)
        if(resp.statusCode == 204){
          console.log('User delete Successful');
          res.status(204).send(resp);
        }
        else if(resp.statusCode == 404){
          console.log('User not found');
          res.status(422).send(resp);
        }
      }
      else{
        res.status(500).send("rails server not responding");
      }
    });
  };

  /*Password change
    curl -H 'Content-Type: application/json' -d '{"user":{"old_password":"spree123","new_password":"spree1234","new_password_confirmation":"spree1234"}}' -X PUT http://127.0.0.1:9000/api/userManager/:id/edit/change_password
  */
  exports.change_password = function(req, res){
    console.log(req.params.id)
    http.put({
      uri: env.spree.host+env.spree.users+'/'+req.params.id+'/edit/change_password.json',
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      console.log(body)
      if(body !== undefined){
        var resp = JSON.parse(body)
        console.log(resp.statusCode)
        if(resp.statusCode == 201){
          console.log('password reset Successful');
          res.status(201).send(resp);
        }
        else if(resp.statusCode == 404){
          console.log('User not found');
          res.status(404).send(resp);
        }
        else if(resp.statusCode == 400){
          console.log('Password mismatch');
          res.status(400).send(resp);
        }
        else if(resp.statusCode == 401){
          console.log('Unauthorised');
          res.status(401).send(resp);
        }
      }
      else{
        res.status(500).send("rails server not responding");
      }
    });
  };
