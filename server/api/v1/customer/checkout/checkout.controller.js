'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));
var crypto = require('crypto');
var ebs_object = constants.payment.ebs;

function secure_hash_ebs(secret_key,account_id,amount,reference_no,return_url,mode)
{
  console.log('secure hash');
  console.log(secret_key+' '+account_id+' '+amount+' '+reference_no+' '+return_url+' '+mode);
  var genStr = secret_key + "|" + account_id + "|" + amount + "|" + reference_no + "|" +return_url + "|" + mode
  console.log('genStr', genStr);
  var generatedhash = crypto.createHash('md5').update(genStr).digest("hex");
  console.log('generatedhash', generatedhash);
  return generatedhash
}


/*Proceed to checkout address,cart --> Address*/
exports.checkout_address = function(req, res){
  console.log(req.params.number);
  console.log(req.query.order_token);

  http.put({
    uri: constants.spree.host+constants.spree.checkouts+'/'+req.params.number+'/next.json?order_token='+req.query.order_token,
    body:'',
    headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
  },function(error,response,body){
    console.error('error',error);
    console.log('res',body);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

/*Proceed to checkout delivery, Address --> Shipping Methods*/
exports.checkout_delivery  = function(req, res){
  console.log(req.params);
  console.log(req.query);
  http.put({
    uri: constants.spree.host+constants.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

/*proceed to checkout payment, Shipping Methods --> Payment*/
exports.checkout_payment  = function(req, res){
  console.log('shipments', req.body);
  http.put({
    uri: constants.spree.host+constants.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      if(body !== {} && body != undefined){
        var temp = JSON.parse(body);
        var hash = secure_hash_ebs(ebs_object.secret_key, ebs_object.account_id, parseFloat(temp.total), temp.number, ebs_object.return_url, ebs_object.mode);
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
      uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/apply_coupon_code?order_token='+req.query.order_token,
      headers:{
        'content-type': 'application/x-www-form-urlencoded',
        'X-Spree-Token': req.headers['X-Spree-Token']
      },
      body: 'coupon_code='+req.params.code
    }, function(error, response, body){
      if(error){
        res.status(500).send(error.syscall);
      }
      else{
        res.status(response.statusCode).send(body);
      };
    });
};


/*Confirm Payment*/
exports.checkout_confirm_payment = function(req, res){
  http.put({
    uri: constants.spree.host+constants.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

/*Complete checkout*/
exports.checkout_complete = function(req, res){
  http.put({
    uri: constants.spree.host+constants.spree.checkouts+'/'+req.params.number+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};
