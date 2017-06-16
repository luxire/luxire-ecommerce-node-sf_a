angular.module('luxire')
.service('CustomerConstants', function(){
  this.api = {
//    host: 'https://luxire-store.cloudhop.in', //spree host
    host: 'https://store.luxire.com/',
    products: '/api/v1/products',
    product_types: '/api/v1/product_types',
    style_masters: '/api/v1/style_masters',
    get_incomplete_order: '/api/orders/incomplete',
    orders: '/api/v1/orders',
    checkouts: '/api/v1/checkouts',
    get_location_by_ip: '/api/v1/generic/location'
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
    var fd = new FormData();
    fd.append('source', 'customer image');
    fd.append('image', image);
    fd.append('size', '128x128');
    return $http.post(CustomerConstants.api.products+'/custom_image_upload', fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
     });
  };
})
.service('CustomerProducts', function($http, CustomerConstants, CacheFactory){
  if(!CacheFactory.get('ProductCache')){
    CacheFactory.createCache('ProductCache', {
        deleteOnExpire: 'aggressive',
      });
  }
  var product_cache = CacheFactory.get('ProductCache');

  this.index = function(){
    return $http.get(CustomerConstants.api.products);
  };

  this.searchProducts = function(search_phrase){
    return $http.get(CustomerConstants.api.products+'?q[name_cont]='+search_phrase, {
      cache: product_cache
    });
  };

  this.search_products_in_redis = function(query_object){
    return $http.post(CustomerConstants.api.products+"/search", angular.toJson(query_object));
  };

  var active_collections = ["shirts", "pants", "accessories", "ties", "pocket squares","giftcards"];
  this.is_active_collections = function(collection){
    var collection = collection.toLowerCase();
    var is_active_collection = false;

    for(var i=0;i<active_collections.length;i++){
      if(collection.indexOf(active_collections[i]) !== -1){
        is_active_collection = true;
      }
    }
    if(is_active_collection){
      return true;
    }
    return false;
  };

  this.show = function(product_name){
    return $http.get(CustomerConstants.api.products+'/'+product_name, {
      cache: product_cache
    });
  };

  this.standard_sizes = function(fit_type, neck_size){
    return $http.get(CustomerConstants.api.product_types+'/standard_sizes?fit_type='+fit_type+'&neck_size='+neck_size);
  };

  /*Taxonomy=>Super Collections*/
  this.taxonomy_index = function(taxonomy_id){
    return $http.get(CustomerConstants.api.products+'/taxonomies', {
      cache: product_cache
    });
  };

  this.taxonomy_show = function(taxonomy_id){
    return $http.get(CustomerConstants.api.products+'/taxonomies/'+taxonomy_id);
  };

  //Used for product listing
  this.collections = function(filters){
    return $http.post(CustomerConstants.api.products+'/collections', angular.toJson(filters));

    // return $http.get(CustomerConstants.api.products+'/collections?permalink='+permalink+'&page='+page);
    // return $http.get(CustomerConstants.api.products+'/collections?permalink='+permalink+'&page='+page, {
    //   cache: product_cache
    // });
  };
  // //Used for product listing
  // this.collections = function(permalink, page){
  //   return $http.get(CustomerConstants.api.products+'/collections?permalink='+permalink+'&page='+page);
  //
  //   // return $http.get(CustomerConstants.api.products+'/collections?permalink='+permalink+'&page='+page);
  //   // return $http.get(CustomerConstants.api.products+'/collections?permalink='+permalink+'&page='+page, {
  //   //   cache: product_cache
  //   // });
  // };

  this.taxon_index = function(taxonomy_id, taxon_id){
    return $http.get(CustomerConstants.api.products+'/taxonomies/'+taxonomy_id+'/taxons/'+taxon_id);
  };

  this.filter_properties = function(){
    return $http.get(CustomerConstants.api.products+'/properties',{
      cache: product_cache
    });
  };
  this.product_types = function(){
    return $http.get(CustomerConstants.api.product_types);
  };
  this.recommended = function(id){
    return $http.post(CustomerConstants.api.products+'/recommended', angular.toJson({ref_id: id}));
  };
  this.apply_filters = function(filter_object){
    return $http.post(CustomerConstants.api.products+'/filters',angular.toJson(filter_object));
  };

})
.service('CustomerOrders', function($http, CustomerConstants, CustomerUtils){

  /*Order*/
  this.get_order_by_cookie = function(){
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

  this.create_order = function(cartObject, variant, sample, selected_currency, selected_measurement_unit){
    var order = {
      order: {
        currency: CustomerUtils.get_local_currency_in_app(),
        line_items: [
          {
            variant_id: variant.id,
            quantity: 1,
            luxire_line_item:{
              total_personalisation_cost_in_currencies: cartObject && cartObject.personalization_cost ? cartObject.personalization_cost : 0 ,
              total_personalization_cost: cartObject && cartObject.personalization_cost && cartObject.personalization_cost[selected_currency] ? cartObject.personalization_cost[selected_currency] : 0,
              send_sample: sample ? true : false,
              measurement_unit: selected_measurement_unit,
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

  this.update = function(order, updated_order_object){
    return $http.put(CustomerConstants.api.orders+'/'+order.number+'?order_token='+order.token, angular.toJson(updated_order_object));
  };

  /*line_items*/

  this.add_line_item = function(order, cartObject, variant, send_sample, selected_currency, selected_measurement_unit){
    var line_item = {
      line_item: {
        variant_id: variant.id,
        quantity: 1,
        luxire_line_item:{
          total_personalisation_cost_in_currencies: cartObject && cartObject.personalization_cost ? cartObject.personalization_cost : 0 ,
          total_personalization_cost: cartObject && cartObject.personalization_cost && cartObject.personalization_cost[selected_currency] ? cartObject.personalization_cost[selected_currency] : 0,
          send_sample: send_sample ? true : false,
          measurement_unit: selected_measurement_unit,
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

   this.add_giftCard_line_item = function(order, cartObject, variant, send_sample, selected_currency, selected_measurement_unit){
    var line_item = {
      line_item: {
        variant_id: variant.id,
        quantity: 1
      }
    }
      return $http.post(CustomerConstants.api.orders+'/'+order.number+'/line_items?order_token='+order.token, angular.toJson(line_item));
    }

  this.delete_line_item = function(order, line_item_id){
    return $http.delete(CustomerConstants.api.orders+'/'+order.number+'/line_items/'+line_item_id+'?order_token='+order.token);
  };

  this.update_line_item = function(order, line_item_id,variant_id,quantity){
		var updated_cart = {
			order_number: order.number,
			order_token: order.token,
			line_item_id: line_item_id,
			variant_id: variant_id,
			quantity: quantity
		};
		return $http.put(CustomerConstants.api.orders+'/'+order.number+'/line_items/'+line_item_id+'?order_token='+order.token, angular.toJson(updated_cart));
	};

  this.updated_order_measurement_unit = function(order, luxire_line_items){
    var order_obj = {
      order: {
        number: order.number,
        token: order.token,
        luxire_line_items : luxire_line_items
      }
    };
    return $http.put(CustomerConstants.api.orders+'/'+order.number+'/update_order_measurement_unit', angular.toJson(order_obj));
  }

  this.update_order_currency = function(order){
    var order_obj = {
      order_number: order.number,
      updated_currency: CustomerUtils.get_local_currency_in_app(),
      order_token: order.token
    };
    return $http.put(CustomerConstants.api.orders+'/'+order.number+'/update_order_currency', angular.toJson(order_obj));
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
		return $http.post(CustomerConstants.api.checkouts+'/'+order.number+"/payment?order_token="+order.token, angular.toJson(shipment));
	};
	this.apply_coupon_code = function(order, coupon_code){
		return $http.post(CustomerConstants.api.orders+'/'+order.number+'/apply_coupon_code/'+coupon_code+'?order_token='+order.token, '');
	};

  this.apply_gift_card = function(order, gift_card_code){
    var gift_card = {
      gift_card_code: gift_card_code,
      order_token: order.token
    };
    return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/apply_gift_card', angular.toJson(gift_card));
  };

  this.checkout_payment_pay_pal = function(payment_method_id, order){
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


  this.auto_complete = function(order){
    return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/auto_complete?order_token='+order.token, '');
  };

  this.brain_tree_init = function(payment_method_id, order){
    return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/payments/brain_tree_init?order_token='+order.token+'&payment_method_id='+payment_method_id);
  };
  this.checkout_paypal_brain_tree = function(order, brain_tree_object){
    return $http.post(CustomerConstants.api.checkouts+'/'+order.number+'/payments/brain_tree?order_token='+order.token, angular.toJson(brain_tree_object));
  };
})
.service('CustomerUtils', function($http, CustomerConstants, $sce){
  //passed by ref
  var exclusion_list = ['id','cost'];
  var local_currency = "";

  this.convert_cm_to_in = function(measurement_obj){
    var cm_to_in = function(measurement_obj){
      angular.forEach(measurement_obj, function(val,key){
        if(exclusion_list.indexOf(key) === -1){
          if(!angular.isObject(val) && !isNaN(parseFloat(val))){
            measurement_obj[key] = (Math.round((parseFloat(val)/2.54)*10)/10).toFixed(2);
          }
          else if(angular.isObject(val)){
            cm_to_in(val);
          }
        }
      });
    };
    cm_to_in(measurement_obj);
  };
  this.convert_in_to_cm = function(measurement_obj){
    var in_to_cm = function(measurement_obj){
      angular.forEach(measurement_obj, function(val,key){
        if(exclusion_list.indexOf(key) === -1){
          if(!angular.isObject(val) && !isNaN(parseFloat(val))){
            measurement_obj[key] = (Math.round(parseFloat(val)*2.54*10)/10).toFixed(2);
          }
          else if(angular.isObject(val)){
            in_to_cm(val);
          }
        }
      });
    };
    in_to_cm(measurement_obj);

  };
  this.get_local_currency = function(){
    return $http.get(CustomerConstants.api.get_location_by_ip);
  };
  this.set_local_currency_in_app = function(currency){
    local_currency = currency;
  };
  this.get_local_currency_in_app = function(){
    return local_currency;
  };

  this.contact_us = function(user){
    return $http.post('/api/v1/contact_us', angular.toJson(user));
  };

  this.get_currency_with_symbol = function(val, currency){
    if(currency == "INR"){
      return $sce.trustAsHtml('&#8377;'+val);
    }
    else if(currency == "USD"){
      return $sce.trustAsHtml('&#36;'+val);
    }
    else if(currency == "EUR"){
      return $sce.trustAsHtml('&euro;'+val);
    }
    else if(currency == "SGD"){
      return $sce.trustAsHtml('&#36;'+val);
    }
    else if(currency == "AUD"){
      return $sce.trustAsHtml('a;'+val);//$
    }
    else if(currency == "SEK"){
      return $sce.trustAsHtml(val+' kr');
    }
    else if(currency == "DKK"){
      return $sce.trustAsHtml(val+' kr');
    }
    else if(currency == "CHF"){
      return $sce.trustAsHtml('CHF'+val);
    }
    else if(currency == "NOK"){
      return $sce.trustAsHtml(val+' kr');
    }
    else if(currency == "GBP"){
      return $sce.trustAsHtml('&pound;'+val);
    }
    else if(currency == "CAD"){
      return $sce.trustAsHtml('&#36;'+val);
    }
  };

})
.service('ProductType', function(){
  this.shirts = function(){
    return {
      cloth_measurement_attributes: {
        "Collar Size": [],
        "Chest": ["Chest(Front)", "Chest(Back)"],
        "Waist": ["Waist(Front)", "Waist(Back)"],
        "Bottom": ["Bottom(Front)", "Bottom(Back)"],
        "Yoke": ["Yoke(Left)", "Yoke(Right)"],
        "Sleeve Width": ["Sleeve Width(Left)", "Sleeve Width(Right)"],
        "Armhole": ["Armhole(Left)", "Armhole(Right)"],
        "Forearm": ["Forearm(Left)", "Forearm(Right)"],
        "Cuff Around": ["Cuff Around(Left)", "Cuff Around(Right)"],
        "Shoulder Slope": ["Shoulder Slope(Left)", "Shoulder Slope(Right)"],
        "Back Panel Slope": ["Back Panel Slope(Left)", "Back Panel Slope(Right)"],
        "Sleeve Length": ["Sleeve Length (Left)", "Sleeve Length(Right)"],
        "Shirt Length": []
      },
      attributes_order: ['chest', 'waist', 'bottom', 'yoke', 'sleeve width', 'armhole', 'forearm', 'cuff around', 'shoulder slope', 'back panel slope', 'sleeve length']

    };
  };
  this.pants = function(){
    return {
      cloth_measurement_attributes: {
        "Waist": [],
        "Hips": ["Hips(Front)", "Hips(Back)"],
        "Front Rise": [],
        "Back Rise": [],
        "Inseam": ["Inseam(Left)", "Inseam(Right)"],
        "Outseam": ["Outseam(Left)", "Outseam(Right)"],
        "Thigh": [],
        "Knee": [],
        "Bottom": []
      }
    };
  }
});

  // this.update_cart_by_quantity = function(order, line_item_id,variant_id,quantity){
	// 	var updated_cart = {
	// 		order_number: order.number,
	// 		order_token: order.token,
	// 		line_item_id: line_item_id,
	// 		variant_id: variant_id,
	// 		quantity: quantity
	// 	};
	// 	return $http.put(CustomerConstants.api.orders+'/'+order.number+'/?order_token='+order.token, angular.toJson(updated_cart));
	// };
