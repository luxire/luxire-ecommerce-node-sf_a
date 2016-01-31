'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');
var crypto = require('crypto');
var path = require('path');
var ebs_object = env.payment.ebs;

function secure_hash_ebs(secret_key,account_id,amount,reference_no,return_url,mode)
{
  var genStr = secret_key + "|" + account_id + "|" + amount + "|" + reference_no + "|" +return_url + "|" + mode
  var generatedhash = crypto.createHash('md5').update(genStr).digest("hex");
  return generatedhash
}


/*Proceed to checkout address,cart --> Address*/
exports.checkout_address = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'/next.json?order_token='+req.params.token,
    body:''
  },function(error,response,body){
    console.error('error',error);
    console.log('res',response);
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for updating address, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Internal Server Error");
      console.log('req from'+req.connection.remoteAddress+'for updating address, responded with'+error);
    }
  });
};

/*Proceed to checkout delivery, Address --> Shipping Methods*/
exports.checkout_delivery  = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.params.token,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for updating ship_methods, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Internal Server Error");
      console.log('req from'+req.connection.remoteAddress+'for updating ship_methods, responded with'+error);

    }
  });
};

/*proceed to checkout payment, Shipping Methods --> Payment*/
exports.checkout_payment  = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.params.token,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      if(body !== {} && body != undefined){
        var temp = JSON.parse(body);
        var hash = secure_hash_ebs(ebs_object.secret_key, ebs_object.account_id, temp.total, temp.number, ebs_object.return_url, ebs_object.mode);
        console.log(hash);
        temp.secure_hash = hash;
        body = JSON.stringify(temp);
      }
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for updating ship_payments, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Internal Server Error");
      console.log('req from'+req.connection.remoteAddress+'for updating ship_payments, responded with'+error);

    }
  });

};


/*Return url for EBS*/
exports.checkout_gateway_response = function (req, res){
  console.log(req.body);
  console.log(path.resolve('server/views'));
  // var txn_res = {
  // "ResponseCode":"0",
  // "ResponseMessage":"Transaction Successful","DateCreated":"2016-01-29 15:11:17",
  // "PaymentID":"48007149","MerchantRefNo":"R486521524","Amount":"39.95",
  // "Mode":"TEST","BillingName":"Mudassir H","BillingAddress":"#74,1st cross",
  //  "BillingCity":"Boston","BillingState":"Massachusetts",
  //  "BillingPostalCode":"02108","BillingCountry":"USA","BillingPhone":"8951442694",
  //  "BillingEmail":"m@a.com","DeliveryName":"","DeliveryAddress":"",
  //  "DeliveryCity":"","DeliveryState":"","DeliveryPostalCode":"",
  //  "DeliveryCountry":"","DeliveryPhone":"","Description":"luxire",
  //  "IsFlagged":"NO","TransactionID":"127442933","PaymentMethod":"1001",
  //  "RequestID":"11283982","SecureHash":"35fcb0df939b3ad05f6d0b8faec44b70"};
  // res.status(200).send(req.body);
  res.status(200).render(path.join(path.resolve('server/views')+'/payment_response.ejs'),{ txn_res: req.body });
};

/*Apply coupon code*/
exports.checkout_apply_coupon_code = function (req, res){
  console.log(req.params);
  http
    .put({
      uri: env.spree.host+env.spree.orders+'/'+req.params.number+'/apply_coupon_code?order_token='+req.params.token,
      headers:{'content-type': 'application/x-www-form-urlencoded'},
      body: 'coupon_code='+req.params.code
    }, function(error, response, body){
        if(error == null){
          res.status(response.statusCode).send(body);
          console.log('req from'+req.connection.remoteAddress+'for applying coupon code, responded with'+response.statusCode);

        }else{
          res.status(500).send("Rails Server Not Responding");
          console.log('req from'+req.connection.remoteAddress+'for applying coupon code, responded with'+error);

        }
    });
};

/*check*/
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
/*proceed to checkout gateway directly */
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
      console.log('req from'+req.connection.remoteAddress+'for payments gateways, responded with'+response.statusCode);

    }
    else{
      res.status(500).send("Internal Server Error");
      console.log('req from'+req.connection.remoteAddress+'for payments gateways, responded with'+error);

    }
  });

};


/*Confirm Payment*/
exports.checkout_confirm_payment = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.query.order_token,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for updating ship_payments, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Internal Server Error");
      console.log('req from'+req.connection.remoteAddress+'for updating ship_payments, responded with'+error);

    }
  });
};

/*Complete checkout*/
exports.checkout_complete = function(req, res){
  http.put({
    uri: env.spree.host+env.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.query.order_token,
    headers:{'content-type': 'application/json'},
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for updating ship_payments, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Internal Server Error");
      console.log('req from'+req.connection.remoteAddress+'for updating ship_payments, responded with'+error);

    }
  });
};
