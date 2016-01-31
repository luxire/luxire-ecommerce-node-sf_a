'use strict';
var _ = require('lodash');
var http = require('request');
var querystring = require('querystring');
// var qs = require('qs');
var env = require('../../config/constants');


exports.index = function(req, res) {
  console.log("searching is calling in node server\n");
      client.exists("searchAllData", function(err,reply){
        var token='99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
          if(reply === 1){
            client.get("searchAllData", function(err,data){
                if(err == null){
                  console.log("fetching search data from redis server...");
                  res.status(200).send(JSON.parse(data));
                }else{
                  http
                    .post(env.spree.host+'/search/get_all_data?token='+token, function(error, response, body){
                      if(error==null){
                        res.status(response.statusCode).send(body);
                      }
                      else{
                        res.status(500).send("Rails server not responding");
                      };
                  });
                }
            });
          }else{
            http
              .post(env.spree.host+'/search/get_all_data?token='+token, function(error, response, body){
                if(error==null){
                  client.set("searchAllData",JSON.stringify(body));
                  console.log("\nsearchAllData store in redis server is sucessfull\n");
                  res.status(response.statusCode).send(body);
                }
                else{
                  res.status(500).send("Rails server not responding");
                };
            });

          }
      });
};
