'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


/*Proceed to checkout address*/
exports.checkout_address = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'/next.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    body:''
  },function(error,response,body){
    console.error(error);
    console.log(response);
    if(error == null){
      res.status(response.statusCode).send(body);
    }
    else{
      res.status(500).send("Internal Server Error");
    }
  });
};

  /*Proceed to checkout delivery*/
  exports.checkout_delivery  = function(req, res){
    http.put({
      uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Internal Server Error");
      }
    });
  };

  /*proceed to checkout payment*/
  exports.checkout_payment  = function(req, res){
    console.log(req);
    http.put({
      uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
      headers:{'content-type': 'application/json'},
      body:JSON.stringify(req.body)
    },function(error,response,body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Internal Server Error");
      }
    });

  };

  /*proceed to checkout payment */
  exports.checkout_gateway  = function(req, res){
    console.log(req.body);
    // var ebs = {"vpc_ReferenceNo":"R987886379","vpc_Amount":39.95,"vpc_Mode":"TEST","vpc_Description":"luxire","vpc_Name":"Mudassir H","vpc_Address":"74","vpc_City":"Boston","vpc_State":"Massachusetts","vpc_PostalCode":"02108","vpc_Country":"USA","vpc_Email":"","vpc_Phone":"","vpc_ShipName":"Mudassir H","vpc_ShipAddress":"74","vpc_ShipCity":"Boston","vpc_ShipState":"Massachusetts","vpc_ShipPostalCode":"02108","vpc_ShipCountry":"USA","vpc_PaymentOption":"credit","vpc_CardNo":"4111111111111111","vpc_ExpiryDate":"07/16","vpc_Cvv":"123","vpc_Issuingbank":"EBS","vpc_ReturnUrl":"","vpc_GoBackUrl":""}
    http.post({
      uri: 'http://test.luxire.com:3000/send_request_pg/send',
      headers:{'content-type': 'application/json'},
      body: JSON.stringify(req.body)
    },function(error,response,body){
      console.log(body);
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Internal Server Error");
      }
    });

  };

  exports.checkout_gateway_response = function (req, res){
    console.log(req);
  };





  /*proceed to checkout payment*/
  exports.check  = function(req, res){
    console.log(req);
    http.get({
      uri: 'http://test.luxire.com:3000/test/check',
      body: ''
    },function(error,response,body){
      console.log(response);
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Internal Server Error");
      }
    });

  };
