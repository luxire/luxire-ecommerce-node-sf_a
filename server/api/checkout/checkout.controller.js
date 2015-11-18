'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


/*Proceed to checkout*/
exports.checkout_address = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.body.number+'/next.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body:''
  },function(error,response,body){
      res.status(200).send("OK")
  })

};
