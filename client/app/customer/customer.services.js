angular.module('luxire')
.service('CustomerConstants', function(){
  this.api = {
    host: 'http://54.169.41.36:3000',
    products: '/api/v1/products',
    product_types: '/api/v1/product_types',
    style_masters: '/api/v1/style_masters',
    get_incomplete_order: '/api/orders/incomplete',
  };
})
.service('ImageHandler', function(CustomerConstants){
  this.url = function(path){
    if(angular.isDefined(path)){
      if(path.indexOf('http')>-1){
        return path;
      }
      else{
        return CustomerConstants.api.host+path;
      }

    }
  };
})
.service('CustomerProducts', function($http, CustomerConstants){
  this.index = function(){
    return $http.get(CustomerConstants.api.products);
  };
  this.show = function(product_name){
    return $http.get(CustomerConstants.api.products+'/'+product_name);
  };
})
.service('CustomerOrders', function($http, CustomerConstants){
  this.get_order_by_cookie = function(){
    console.log('get order by cookie');
    return $http.get(CustomerConstants.api.get_incomplete_order);
  };
	this.get_order_by_id = function(order_number, order_token){
		return $http.get('/api/orders/'+order_number+'/'+order_token);
	};

	this.addTocart = function(cartObject, variant){
		var cart = {
		  order: {
		    line_items: [
		      { variant_id: variant.id,
            quantity: 1,
            luxire_line_item_attributes:{
              customized_data: cartObject.customization_attributes,
              personalize_data: cartObject.personalization_attributes,
              measurement_data: {
                standard_measurement_attributes: cartObject.standard_measurement_attributes,
                body_measurement_attributes: cartObject.body_measurement_attributes
              }
            }
          }
		    ]
		  }
		}
		return $http.post("/api/orders", angular.toJson(cart));
	};
	this.update_cart_by_quantity = function(order_number, order_token, line_item_id,variant_id,quantity){
		var updated_cart = {
			order_number: order_number,
			order_token: order_token,
			line_item_id: line_item_id,
			variant_id: variant_id,
			quantity: quantity
		}
		return $http.put("/api/orders", angular.toJson(updated_cart));
	};
	this.proceed_to_checkout = function(order_number, order_token){
		return $http.post("/api/checkouts/"+order_number+"/"+order_token+"/next", '');
	};
	this.proceed_to_checkout_delivery = function(order_number, order_token, order_address){
		console.log(order_number,order_address);
		return $http.post("/api/checkouts/"+order_number+"/"+order_token+"/delivery", angular.toJson(order_address));
	};
	this.proceed_to_checkout_payment = function(order_number,order_token, shipment_id, shipping_rate_id){
		var shipment = {
		  "order": {
		    "shipments_attributes": {
		      "0": {
		        "selected_shipping_rate_id": shipping_rate_id,
		        "id": shipment_id
		      }
		    }
		  }
		}
		return $http.post("/api/checkouts/"+order_number+"/"+order_token+"/payment", shipment);
	};
	this.proceed_to_checkout_gateway = function(order_number, payment_object){
		console.log('order_number',order_number);
		console.log('payment_object', payment_object);
		return $http.post('/api/checkouts/'+order_number+'/gateway', angular.toJson(payment_object));
	};
	this.apply_coupon_code = function(order_number,order_token, coupon_code){
		return $http.post('/api/checkouts/'+order_number+"/"+order_token+'/apply_coupon_code/'+coupon_code, '');
	};
	this.request_ebs = function(ebs_object){
		console.log(ebs_object);
		var enc_ebs_object = $.param(ebs_object);
		console.log(enc_ebs_object);
		return $http({
          method  : 'POST',
          url     : 'https://secure.ebs.in/pg/ma/payment/request',
          data    : enc_ebs_object,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
				});
		// return $http.post('https://secure.ebs.in/pg/ma/payment/request', angular.toJson(ebs_object));


	};
	this.checkout_confirm_payment = function(order_number,order_token){
		var payment = {
		  "order": {
		    "payments_attributes": {
		      "payment_method_id": 2//for check
		    }
		  }
		}
		return $http.post("/api/checkouts/"+order_number+"/confirm?order_token="+order_token, payment);
	};
	this.checkout_complete = function(order_number,order_token){
		var payment = {
		  "order": {
		    "payments_attributes": {
		      "payment_method_id": 2//for check
		    }
		  }
		}
		return $http.post("/api/checkouts/"+order_number+"/complete?order_token="+order_token, payment);
	};
})
