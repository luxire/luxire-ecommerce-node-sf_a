'use strict';

var express = require('express');
var controller = require('./promotion.controller');
var router = express.Router();
var jwt = require('jsonwebtoken');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));


router.use(function(req, res, next){
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


router.get('/', controller.index);
router.post('/', controller.create);
router.delete('/:id', controller.destroy);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.post('/:id/rules', controller.add_rule);
router.delete('/:id/rules/:rule_id', controller.delete_rule);
router.post('/:id/actions', controller.add_action);
router.post('/:id/actions/:action_id', controller.delete_action);//delete an action

// router.get('/:id', controller.show);




module.exports = router;
