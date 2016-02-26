'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.index = function(req, res){
  http.get({
    uri: env.spree.host+env.spree.orders+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    body: ''
  },function(error, response, body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for reading order, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Rails server not responding")
      console.log('req from'+req.connection.remoteAddress+'for reading order, responded with'+error);
    };
  });
};
exports.show = function(req, res){
  console.log('req from'+req.connection.remoteAddress);
  console.log(req.params);
  console.log(req.body);
  http.get({
    uri: env.spree.host+env.spree.orders+'/'+req.params.number+'?order_token='+req.params.token,
    body: ''
  },function(error, response, body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for reading order, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Rails server not responding")
      console.log('req from'+req.connection.remoteAddress+'for reading order, responded with'+error);

    };
  });
};

/*Get incomplete order*/
exports.incomplete_order = function(req, res){
  console.log('req cookies',req.cookies);
  console.log(env.spree.host+env.spree.incomplete_order);
  http.get({
    uri: env.spree.host+env.spree.incomplete_order,
    headers:{
      'Cookie': 'guest_token='+req.cookies.guest_token
    }
  },function(error, response, body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for reading order, responded with'+response.statusCode);
    }
    else{
      res.status(500).send("Rails server not responding")
      console.log('req from'+req.connection.remoteAddress+'for reading order, responded with'+error);

    };
  });
};



/*Create a blank order*/
exports.create_blank_order = function(req, res){
  http.post({
    uri: env.spree.host+env.spree.orders+'.json',
    body: '{}'
  }, function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for creating blank order, responded with'+response.statusCode);

    }
    else{
      res.status(500).send("Rails server not responding");
      console.log('req from'+req.connection.remoteAddress+'for creating  blank order, responded with'+error);

    };
  })
  // uri: env.spree.host+env.spree.orders+'.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',

};

/*Create a new order, with existing details about the customer*/
exports.create = function(req, res){
  console.log('In order controller', req.cookies.guest_token);
  console.log(req.body);
  http.post({
    uri: env.spree.host+env.spree.orders+'?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{
      'content-type': 'application/json',
      'Cookie': 'guest_token='+req.cookies.guest_token
    },
    body:JSON.stringify(req.body)
  },function(error,response,body){
    if(error == null){
      console.log(body);
      res.send(response);
      // res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for creating blank order, responded with'+response.statusCode);

    }
    else{
      res.status(500).send("Rails server not responding");
      console.log('req from'+req.connection.remoteAddress+'for creating  order, responded with'+error);

    };
  });

};

/*Update quantity of item in cart*/
/*Todo change order_number to params*/
// exports.update = function(req, res){
//   console.log(req.params);
//   console.log(req.body);
//   console.log(req.query);
//   // console.log(req.body);
//   // console.log(env.spree.host+env.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token);
//   // //localhost:3000/api/orders/R187211063/line_items/114?line_item[variant_id]=29&line_item[quantity]=4&order_token=EBCe8QS2YnLBnVUYZk37Ug
//   http.put({
//     uri: env.spree.host+env.spree.orders+'/'+req.params.number+'?order_token='+req.body.order_token,
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
  console.log(env.spree.host+env.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token);
  //localhost:3000/api/orders/R187211063/line_items/114?line_item[variant_id]=29&line_item[quantity]=4&order_token=EBCe8QS2YnLBnVUYZk37Ug
  http.put({
    uri: env.spree.host+env.spree.orders+'/'+req.body.order_number+'/line_items/'+req.body.line_item_id+'?line_item[variant_id]='+req.body.variant_id+'&line_item[quantity]='+req.body.quantity+'&order_token='+req.body.order_token,
    headers:{'content-type': 'application/json'},
    body:''
  },function(error,response,body){
    console.log(body);
    if(response){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for updating order, responded with'+response.statusCode);

    }
    else{
      res.status(500).send("Rails server not responding");
      console.log('req from'+req.connection.remoteAddress+'for updating  order, responded with'+error);

    }
  })
};

/*Add line item to cart*/
exports.add_line_item = function(req, res){
  http.post({
    uri: env.spree.host+env.spree.orders+'/'+req.params.number+'/line_items.json?token=99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058',
    headers:{'content-type': 'application/json'},
    body: JSON.stringify(req.body)
  }, function(error,response,body){
    if(error == null){
      res.status(response.statusCode).send(body);
      console.log('req from'+req.connection.remoteAddress+'for adding lineitem, responded with'+response.statusCode);

    }
    else{
      res.status(500).send("Rails server not responding")
      console.log('req from'+req.connection.remoteAddress+'for adding lineitem, responded with'+error);

    };
  })
};

exports.get_payment_methods = function(req, res){
  http.get({
    uri: env.spree.host+env.spree.orders+'/'+req.params.number+'/'+env.spree.payments+'?order_token='+req.query.order_token,
    body: ''
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
