'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.myAccount = function(req, res){
      var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
      console.log("query parameter is : ",req.query);
      http.post({
        uri: env.spree.host+env.spree.myAccount+'?token='+req.query.token,
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      },function(error,response,body){

        console.log(error);
         if(error == null){
             console.log("\n\npost : /my_account response: \n\n"+body);
             res.status(response.statusCode).send(body);
         }
         else{
           res.status(500).send("Internal Server Error");
         }
    });
  };
