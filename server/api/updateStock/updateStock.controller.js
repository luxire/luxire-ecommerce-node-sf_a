'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');

exports.updateStock = function (req, res){
      console.log("-----------------------------");
      var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
        http
          .put({
            uri: env.spree.host+env.spree.updateStock+"/"+req.params.id+'?token='+token_id,
            headers:{'content-type': 'application/json'},
            body:JSON.stringify(req.body)
          }, function(error, response, body){
              if(error == null){
                  console.log(" \n\nput :  luxire_stocks  response:  \n\n"+body);
                  res.status(response.statusCode).send(body);
              }else{
                res.status(500).send("Rails Server Not Responding");
              }
          });
          console.log("-----------------------------");

  };

  exports.luxireStocks_index = function(req, res) {

    var token_id="99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
    http
      .get(env.spree.host+env.spree.updateStock+"?token="+token_id, function(error, response, body){
        if(error==null){
              console.log("\n\nget : /luxire_stocks   response are as follows: \n\n");
              res.status(response.statusCode).send(body);
              console.log(body);
        }
        else{
          console.log(" /luxire_stocks error :"+error);
          res.status(500).send("Rails server not responding");
        };
    });

  };

  exports.luxireStocks_addQuantity= function(req, res){
        console.log("add quantity is calling...");
        http.post({
          uri: env.spree.host+env.spree.updateStock+'/add_stocks?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
          headers:{'content-type': 'application/json'},
          body:JSON.stringify(req.body)
        },function(error,response,body){

          console.log(error);
           if(error == null){
               console.log("\n\npost : /luxire_stocks/add_stocks  response: \n\n"+body);
               res.status(response.statusCode).send(body);
           }
           else{
             res.status(500).send("Internal Server Error");
           }
      });
    };

    exports.luxireStocks_setQuantity = function(req, res){
        console.log("set quantity is calling...");

          http.post({
            uri: env.spree.host+env.spree.updateStock+'/set_stocks?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
            headers:{'content-type': 'application/json'},
            body:JSON.stringify(req.body)
          },function(error,response,body){

            console.log(error);
             if(error == null){
                 console.log("\n\npost : /luxire_stocks/set_stocks  response: \n\n"+body);
                 res.status(response.statusCode).send(body);
             }
             else{
               res.status(500).send("Internal Server Error");
             }
        });
      };
