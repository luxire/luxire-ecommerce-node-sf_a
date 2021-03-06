'use strict';

var _ = require('lodash');
var http = require('request');
var querystring = require('querystring');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var formidable = require('formidable');
var util = require('util');
var fs = require('fs');

var currency_symbol = "";
var get_currency = function(country_code){
    console.log('country', country_code);
    switch(country_code){
      case "DE":   currency_symbol = "EUR";
                   break;
      case "AU":   currency_symbol = "AUD";
                   break;
      case "SG":   currency_symbol = "SGD";
                   break;
      case "NO":   currency_symbol = "NOK";
                   break;
      case "DK":   currency_symbol = "DKK";
                   break;
      case "SE":   currency_symbol = "SEK";
                   break;
      case "CH":   currency_symbol = "CHF";
                   break;
      case "IN":   currency_symbol = "INR";
                   break;
      default  :   currency_symbol = "USD";
                   break;
    };
    return currency_symbol;
};

//Get product by id

exports.geo_location = function(req, res){
  var req_ip = "";
  var req_cur = "";
  var forwarded_for = "";
  forwarded_for = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if(forwarded_for.includes(',')){
     forwarded_for = forwarded_for.split(',')[0];
  }
  console.log('req ip',req.ip,'forwarded for ip', forwarded_for);

  req_ip = forwarded_for === "127.0.0.1" ? '' : forwarded_for;

  var supported_currencies = ["EUR", "AUD", "SGD", "NOK", "DKK", "SEK", "CHF", "INR", "USD", "GBP", "CAD"];
  console.log('geo_location', req_ip, constants.location_by_ip.host+'/'+req_ip);
  http
    .get({
      uri: constants.location_by_ip.host+'/'+req_ip
    }, function(error, response, body){
        if(error){
          console.log('error getting location', error.syscall);
          res.status(500).send(error.syscall);
        }
        else{
          console.log('req country', body);
          if(JSON.parse(body).country_code){
              http
                .get({
                  uri: constants.spree.host+constants.spree.get_currency_by_country_code+JSON.parse(body).country_code
                }, function(err, resp, res_body){
                    if(err){
                      // res.status(500).send(err.syscall);
                      res.status(200).send("USD");
                    }
                    else{
                      console.log('req country', JSON.parse(res_body));
                      req_cur = JSON.parse(res_body).currency.toUpperCase();
                      console.log('res currency', req_cur);
                      res.status(resp.statusCode).send(supported_currencies.indexOf(req_cur) === -1 ? "USD" : req_cur);
                    };
              });
          }
          else{
            res.status(200).send("USD");
          }

        };



  });
};



exports.getCountryBasedOnIp = function (req, res) {
  var req_ip = "";
  var req_cur = "";
  var forwarded_for = "";
  forwarded_for = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (forwarded_for.includes(',')) {
    forwarded_for = forwarded_for.split(',')[0];
  }
  console.log('req ip', req.ip, 'forwarded for ip', forwarded_for);

  req_ip = forwarded_for === "127.0.0.1" ? '' : forwarded_for;

  var supported_currencies = ["EUR", "AUD", "SGD", "NOK", "DKK", "SEK", "CHF", "INR", "USD"];
  console.log('geo_location', req_ip, constants.location_by_ip.host + '/' + req_ip);
  http
    .get({
      uri: constants.location_by_ip.host + '/' + req_ip
    }, function (error, response, body) {
      if (error) {
        console.log('error getting location', error.syscall);
        res.status(500).send(error.syscall);
      }
      else {
        console.log('req country', body);
        res.json(body);
      }
    })
}

