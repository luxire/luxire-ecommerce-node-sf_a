'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.checkParentSku = function(req, res){
      var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
      console.log("taxonomie create body:  \n"+req.body)

      http.post({
        uri: env.spree.host+env.spree.parentSku+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
        headers:{'content-type': 'application/json'},
        body:JSON.stringify(req.body)
      },function(error,response,body){

        console.log(error);
         if(error == null){
             console.log("\n\npost : /api/measurementType response: \n\n"+body);
             res.status(response.statusCode).send(body);
         }
         else{
           res.status(500).send("Internal Server Error");
         }
    });
  };
