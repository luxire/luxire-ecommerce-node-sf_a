'use strict';

var _ = require('lodash');
var http = require('request');
var path = require('path');
var constants = require(path.resolve('server/api/v1/version_constants'));

exports.index = function(req, res){
  http.get({
    uri: constants.spree.host+constants.spree.orders,
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

/*My account needs to be tested*/
exports.my_account = function(req, res){
  http.post({
    uri: constants.spree.host+constants.spree.my_account,
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

exports.show = function(req, res){
  console.log('req from'+req.connection.remoteAddress);
  console.log(req.params);
  console.log(req.body);
  http.get({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'?order_token='+req.query.order_token,
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
/*Create a blank order*/
exports.create_blank_order = function(req, res){
  http.post({
    uri: constants.spree.host+constants.spree.orders+'.json',
    body: '{}',
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



/*Update quantity of item in cart*/
/*Todo change order_number to params*/
// exports.update = function(req, res){
//   console.log(req.params);
//   console.log(req.body);
//   console.log(req.query);
//   // console.log(req.body);
//   // console.log(constants.spree.host+constants.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token);
//   // //localhost:3000/api/orders/R187211063/line_items/114?line_item[variant_id]=29&line_item[quantity]=4&order_token=EBCe8QS2YnLBnVUYZk37Ug
//   http.put({
//     uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'?order_token='+req.body.order_token,
//     headers:{'content-type': 'application/json'},
//     body: JSON.stringify(req.body)
//   },function(error,response,body){
//     if(error){
//       res.status(500).send(error.syscall);
//     }
//     else{
//       res.status(response.statusCode).send(body);
//     };
//   })
// };
exports.update = function(req, res){
  console.log(req.body);
  console.log(constants.spree.host+constants.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token);
  //localhost:3000/api/orders/R187211063/line_items/114?line_item[variant_id]=29&line_item[quantity]=4&order_token=EBCe8QS2YnLBnVUYZk37Ug
  http.put({
    uri: constants.spree.host+constants.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token,
    headers:{
      'content-type': 'application/json',
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

/*Add line item to cart*/
exports.add_line_item = function(req, res){
  console.log('add new line_item');
  console.log(constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.line_items+'.json?order_token='+req.query.order_token);
  http.post({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+constants.spree.line_items+'.json?order_token='+req.query.order_token,
    headers:{
      'content-type': 'application/json',
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
  http.put({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/'+constants.spree.line_items+'/'+req.params.id+'.json',
    headers:{
      'content-type': 'application/json',
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

/*Delete line item to cart*/
exports.delete_line_item = function(req, res){
  http.del({
    uri: constants.spree.host+constants.spree.orders+'/'+req.params.number+'/'+constants.spree.line_items+'/'+req.params.id+'.json',
    headers:{
      'content-type': 'application/json',
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
