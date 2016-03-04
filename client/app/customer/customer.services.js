angular.module('luxire')
.service('CustomerConstants', function(){
  this.api = {
    host: 'http://54.169.41.36:3000',
    products: '/api/v1/products',
    product_types: '/api/v1/product_types',
    style_masters: '/api/v1/style_masters',
    get_incomplete_order: '/api/orders/incomplete',
    orders: '/api/v1/orders',
    checkouts: '/api/v1/checkouts'
  };
})
.service('ImageHandler', function(CustomerConstants){
  this.url = function(path){
    if(angular.isDefined(path) && !angular.isObject(path)){
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

  this.standard_sizes = function(fit_type, neck_size, shirt_length){
    return $http.get(CustomerConstants.api.product_types+'/standard_sizes?fit_type='+fit_type+'&neck_size='+neck_size+'&shirt_length='+shirt_length);
  };
})
.service('CustomerOrders', function($http, CustomerConstants){
  this.get_order_by_cookie = function(){
    console.log('get order by cookie');
    return $http.get(CustomerConstants.api.orders+'/incomplete');
  };

	this.get_order_by_id = function(order){
		// return $http.get('/api/orders/'+order_number+'/'+order_token);
    return $http.get(CustomerConstants.api.orders+'/'+order.number+'?order_token='+order.token);
	};

  this.create_blank_order = function(){
    return $http.post(CustomerConstants.api.orders+'/new');
  };

  this.create_order = function(cartObject, variant, sample){
    var order = {
      order: {
        line_items: [
          {
            variant_id: variant.id,
            quantity: 1,
            luxire_line_item_attributes:{
              customized_data: cartObject && cartObject.customization_attributes ? cartObject.customization_attributes : {},
              personalize_data: cartObject && cartObject.personalization_attributes ? cartObject.personalization_attributes : {},
              measurement_data: {
                standard_measurement_attributes: cartObject && cartObject.standard_measurement_attributes ? cartObject.standard_measurement_attributes : {},
                body_measurement_attributes: cartObject && cartObject.body_measurement_attributes ? cartObject.body_measurement_attributes : {}
              }
            }
          }
        ],
        special_instructions: sample ? "Customer should send measurement sample" : ""
      }
    };
    return $http.post(CustomerConstants.api.orders, angular.toJson(order));
  };

  this.add_line_item = function(order, cartObject, variant){
    var line_item = {
      line_item: {
        variant_id: variant.id,
        quantity: 1,
        luxire_line_item_attributes:{
          customized_data: cartObject && cartObject.customization_attributes ? cartObject.customization_attributes : {},
          personalize_data: cartObject && cartObject.personalization_attributes ? cartObject.personalization_attributes : {},
          measurement_data: {
            standard_measurement_attributes: cartObject && cartObject.standard_measurement_attributes ? cartObject.standard_measurement_attributes : {},
            body_measurement_attributes: cartObject && cartObject.body_measurement_attributes ? cartObject.body_measurement_attributes : {}
          }
        }
      }
    };
    return $http.post(CustomerConstants.api.orders+'/'+order.number+'/line_items?order_token='+order.token, angular.toJson(line_item));
  };

  this.update_cart_by_quantity = function(order, line_item_id,variant_id,quantity){
		var updated_cart = {
			order_number: order.number,
			order_token: order.token,
			line_item_id: line_item_id,
			variant_id: variant_id,
			quantity: quantity
		}
		return $http.put("/api/orders", angular.toJson(updated_cart));
	};

	this.proceed_to_checkout = function(order){
		return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/address?order_token='+order.token, '');
	};

	this.proceed_to_checkout_delivery = function(order, order_address){
		return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/delivery?order_token='+order.token, angular.toJson(order_address));
	};
	this.proceed_to_checkout_payment = function(order, shipment_id, shipping_rate_id){
		var shipment = {
		  order: {
		    shipments_attributes: {
		      0: {
		        selected_shipping_rate_id: shipping_rate_id,
		        id: shipment_id
		      }
		    }
		  }
		}
    console.log(shipment);
		return $http.post(CustomerConstants.api.checkouts+'/'+order.number+"/payment?order_token="+order.token, angular.toJson(shipment));
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
  this.create_payment = function(order){
    var payment = {
      "payment" : {
          "payment_method_id": order.payment_methods[0].id,
          "amount" : order.total
      }
    }
    return $http.post(CustomerConstants.api.orders+'/'+order.number+'/payments?order_token='+order.token, payment)
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
