angular.module('luxire')
.service('CustomerConstants', function(){
  this.api = {
    host: 'http://104.215.254.150:3000/',
    products: '/api/v1/products',
    product_types: '/api/v1/product_types',
    style_masters: '/api/v1/style_masters',
    get_incomplete_order: '/api/orders/incomplete',
    orders: '/api/v1/orders',
    checkouts: '/api/v1/checkouts'
  };
  this.default = {
    taxonomy_id: 3,
    taxon_id: 13,
    taxonomy_name: 'Shirts',
    taxon_name: 'Casual'
  };
})
.service('ImageHandler', function(CustomerConstants, $http){
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
  this.custom_image_upload = function(image){
    console.log('image', image);
    var fd = new FormData();
    fd.append('source', 'customer image');
    fd.append('image', image);
    fd.append('size', '128x128');
    console.log('fd', fd);
    return $http.post(CustomerConstants.api.products+'/custom_image_upload', fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
     });
  };
})
.service('CustomerProducts', function($http, CustomerConstants){
  this.index = function(){
    console.log('products index', CustomerConstants.api.products);
    return $http.get(CustomerConstants.api.products+'?customer=true');
  };

  this.searchProducts = function(search_phrase){
    return $http.get(CustomerConstants.api.products+'?q[name_cont]='+search_phrase);
  };

  this.show = function(product_name){
    return $http.get(CustomerConstants.api.products+'/'+product_name+'?customer=true');
  };

  this.standard_sizes = function(fit_type, neck_size){
    return $http.get(CustomerConstants.api.product_types+'/standard_sizes?fit_type='+fit_type+'&neck_size='+neck_size);
  };

  /*Taxonomy=>Super Collections*/
  this.taxonomy_index = function(taxonomy_id){
    return $http.get(CustomerConstants.api.products+'/taxonomies/');
  };

  this.taxonomy_show = function(taxonomy_id){
    return $http.get(CustomerConstants.api.products+'/taxonomies/'+taxonomy_id);
  };

  this.collections = function(permalink){
    return $http.get(CustomerConstants.api.products+'/collections?permalink='+permalink);
  };

  this.taxon_index = function(taxonomy_id, taxon_id){
    return $http.get(CustomerConstants.api.products+'/taxonomies/'+taxonomy_id+'/taxons/'+taxon_id);
  };

  this.filter_properties = function(){
    return $http.get(CustomerConstants.api.products+'/properties');
  };
  this.product_types = function(){
    return $http.get(CustomerConstants.api.product_types);
  };

})
.service('CustomerOrders', function($http, CustomerConstants){

  /*Order*/
  this.get_order_by_cookie = function(){
    console.log('get order by cookie');
    return $http.get(CustomerConstants.api.orders+'/incomplete');
  };

	this.get_order_by_id = function(order){
		// return $http.get('/api/orders/'+order_number+'/'+order_token);
    return $http.get(CustomerConstants.api.orders+'/'+order.number+'?order_token='+order.token);
	};

  this. my_orders = function(){
    return $http.get(CustomerConstants.api.orders+'/my_account');
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
            luxire_line_item:{
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

  this.empty_cart = function(order){
    return $http.put(CustomerConstants.api.orders+'/'+order.number+'/empty?order_token='+order.token);
  };

  this.update_cart_by_quantity = function(order, line_item_id,variant_id,quantity){
		var updated_cart = {
			order_number: order.number,
			order_token: order.token,
			line_item_id: line_item_id,
			variant_id: variant_id,
			quantity: quantity
		};
		return $http.put(CustomerConstants.api.orders+'/'+order.number+'/?order_token='+order.token, angular.toJson(updated_cart));
	};

  /*line_items*/

  this.add_line_item = function(order, cartObject, variant){
    var line_item = {
      line_item: {
        variant_id: variant.id,
        quantity: 1,
        luxire_line_item:{
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

  this.delete_line_item = function(order, line_item_id){
    return $http.delete(CustomerConstants.api.orders+'/'+order.number+'/line_items/'+line_item_id+'?order_token='+order.token);
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
	this.apply_coupon_code = function(order, coupon_code){
		return $http.post(CustomerConstants.api.orders+'/'+order.number+'/apply_coupon_code/'+coupon_code+'?order_token='+order.token, '');
	};

  this.checkout_payment_pay_pal = function(payment_method_id, order){
    console.log('payment_method_id', payment_method_id);
    console.log('order', order);
    var payment = {
      payment_method_id: payment_method_id,
      order_id: order.id
    };
    return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/pay_pal_payment?order_token='+order.token, angular.toJson(payment));
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

})
