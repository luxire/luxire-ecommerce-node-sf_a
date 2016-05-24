'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.index = function(req, res){
  http.get({
    uri: constants.spree.host+constants.spree.orders,
    body: '',
    'Cookie': 'guest_token='+req.cookies.guest_token,
    headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

/*My account needs to be tested*/
exports.my_account = function(req, res){
  console.log('my account url', constants.spree.host+constants.spree.my_account);
  console.log('user token', req.headers['X-Spree-Token']);
  http.post({
    uri: constants.spree.host+constants.spree.my_account+'?token='+req.headers['X-Spree-Token'],
    body: '',
    'Cookie': 'guest_token='+req.cookies.guest_token,
    headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

exports.show = function(req, res){
  console.log('req from'+req.connection.remoteAddress);
  console.log(req.params);
  console.log(req.body);
  http.get({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'?order_token='+req.query.order_token,
    body: '',
    'Cookie': 'guest_token='+req.cookies.guest_token,
    headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};
/*Create a blank order*/
exports.create_blank_order = function(req, res){
  http.post({
    uri: constants.spree.host+constants.spree.orders+'.json',
    body: '{}',
    'Cookie': 'guest_token='+req.cookies.guest_token,
    headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
  }, function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};

/*Create a new order, with existing details about the customer*/
exports.create = function(req, res){
  console.log('In order controller', req.cookies.guest_token);
  console.log(req.body);
  http.post({
    uri: constants.spree.host+constants.spree.orders,
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token,
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


/*Get incomplete order*/
exports.incomplete_order = function(req, res){
  console.log('req cookies in incomplete order',req.cookies);
  console.log(constants.spree.host+constants.spree.incomplete_order);
  http.get({
    uri: constants.spree.host+constants.spree.incomplete_order,
    headers:{
      'Cookie': 'guest_token='+req.cookies.guest_token,
      'X-Spree-Token': req.headers['X-Spree-Token']
    }
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

/*Empty order*/
exports.empty_cart = function(req, res){
  console.log(constants.spree.host+constants.spree.orders+'/'+req.params.number+'/empty?order_token='+req.query.order_token);
  http.put({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/empty?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token,
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:''
  },function(error,response,body){
    console.log(body);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};



exports.update = function(req, res){
  console.log('params', req.params);
  console.log('query', req.query);
  console.log('body', req.body);
  http.put({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token,
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body: JSON.stringify(req.body)
  },function(error,response,body){
    console.log(body);
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};

/*Add line item to cart*/
exports.add_line_item = function(req, res){
  console.log('add new line_item');
  console.log(constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.line_items+'.json?order_token='+req.query.order_token);
  http.post({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.line_items+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token,
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body: JSON.stringify(req.body)
  }, function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};

/*Update line item*/
exports.update_line_item = function(req, res){
  console.log('params', req.params);
  console.log('query', req.query);
  console.log('body', req.body);
  http.put({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token,
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body:''
  },function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};

/*Delete line item to cart*/
exports.delete_line_item = function(req, res){
  http.del({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/'+constants.spree.line_items+'/'+req.params.id+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token,
      'X-Spree-Token': req.headers['X-Spree-Token']
    },
    body: JSON.stringify(req.body)
  }, function(error,response,body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  })
};


/**Discount**/
exports.checkout_apply_coupon_code = function (req, res){
  console.log('apply coupon code', req.params);
  console.log(req.params);
  console.log('query params',  req.query);
  console.log('req url', constants.spree.host+constants.spree.orders+'/'+req.params.number+'/apply_coupon_code?order_token='+req.query.order_token);
  http
    .put({
      uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/apply_coupon_code?order_token='+req.query.order_token,
      headers:{'content-type': 'application/x-www-form-urlencoded'},
      'Cookie': 'guest_token='+req.cookies.guest_token,
      body: 'coupon_code='+req.params.code
    }, function(error, response, body){
        console.log('res error', error);
        console.log('res body', body);
        if(error == null){
          res.status(response.statusCode).send(body);
        }else{
          res.status(500).send("Rails Server Not Responding");
        };
    });
};



/**Payments**/
exports.new_payment = function(req, res){
  console.log(constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.payments+'/new?order_token='+req.query.order_token);
  http.get({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.payments+'/new?order_token='+req.query.order_token,
    body: '',
    headers: {'X-Spree-Token': req.headers['X-Spree-Token']}
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      res.status(response.statusCode).send(body);
    };
  });
};

exports.create_payment = function(req, res){
  console.log(req.body);
  console.log(constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.payments+'?order_token='+req.query.order_token);
  http.post({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.payments+'?order_token='+req.query.order_token,
    body: JSON.stringify(req.body),
    headers: {
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    }
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      console.log('payment response', body);
      res.status(response.statusCode).send(body);
    };
  });
};

exports.complete_payment = function(req, res){
  console.log(constants.spree.host+'/receive_ebs_responses/ebs_response');
  http.post({
    uri: constants.spree.host+'/receive_ebs_responses/ebs_response',
    body: JSON.stringify(req.body),
    headers: {
      'content-type': 'application/json',
      'X-Spree-Token': req.headers['X-Spree-Token']
    }
  },function(error, response, body){
    if(error){
      res.status(500).send(error.syscall);
    }
    else{
      console.log('payment response', body);
      res.status(response.statusCode).send(body);
    };
  });
};
