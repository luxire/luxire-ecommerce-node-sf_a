angular.module('luxire')
.service('restApiService', function($http, $q){
		this.get = function(url){
			var deferred = $q.defer();
			$http.get(url).success(function(data){
						deferred.resolve(data);
			}).error(function(errData, errStatus, errHeaders, errConfig){
						deferred.reject({data: errData , status: errStatus ,headers: errHeaders ,Config: errConfig});
			});
			return deferred.promise;
		}
})
.service('prototypeObject',function(){
	this.product = function(){
		this.name = ''
		this.description = ''
		this.price = ''
		this.display_price = ''
		this.available_on = '' //
		this.meta_description = ''
		this.meta_keywords = ''
		this.shipping_category_id = 1
		this.total_on_hand = 10
		this.taxFlag = ''
		this.sku = ''
		this.barcode = ''
		this.weight = ''
		this.onlineStore = ''
		this.prodType = ''
		this.vendor = ''
		this.collections = ''
		this.tags = ''
		this.colorTags = ''
		this.weaveType = ''
		this.threadCount = ''
		this.material = ''
		this.composition = ''
		this.pattern = ''
		this.transparency = ''
		this.wrinkleResistant = ''
	}

	this.customer = function() {
		this.firstName = ''
		this.lastName = ''
		this.email = ''
		this.marketingFlag = ''
		this.taxExemptFlag = ''
		this.firstName1 = ''
		this.lastName1 = ''
		this.company = ''
		this.phone = ''
		this.address1 = ''
		this.address2 = ''
		this.city = ''
		this.zip = ''
		this.country = ''
		this.state = ''
	}

	this.giftCard = function () {
		this.name = ''
		this.description = ''
		this.imageURL = ''
		this.denomination = ''
		this.available_on = '' //
		this.prodType = ''
		this.vendor = ''
		this.collection = ''
		this.tags = ''
	}


})

.service('products', function($http, $q, restApiService){
	//Get all products
	this.getProducts = function(){
		var deferred = $q.defer();
		$http.get('/api/products').then(function(data){
			deferred.resolve(data)
		},function(errData, errStatus, errHeaders, errConfig){
			deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
		});
		return deferred.promise;
	}

	/*search product by name*/
	this.searchProducts = function(search_phrase){
		var deferred = $q.defer();
		$http.get('/api/products?q[name_cont]='+search_phrase).then(function(data){
			deferred.resolve(data.data.products)
		},function(errData, errStatus, errHeaders, errConfig){
			deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
		});
		return deferred.promise;
	}

	this.createProduct = function(product) {
		var deferred = $q.defer();

		$http.post("/api/products", angular.toJson(product)).success(function(res) {
			console.log(res);
			deferred.resolve(res.data);
  		})
  		.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}

	this.getProductByID = function(id) {
		var deferred = $q.defer();
		$http.get("/api/products/"+id).success(function(data) {
			console.log(data)
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}



	this.updateProduct = function(id, prod_parameters) {
		var deferred = $q.defer();
		var parameters = {
			product: prod_parameters
		}
		$http.put("/api/products/"+ id, angular.toJson(parameters)).success(function(data) {
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}

	this.deleteProduct = function(id) {
		var deferred = $q.defer();
		$http.delete("/api/products/"+id).success(function(data) {
			console.log(data);
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}
})

.service('variants', function($http){

	this.get_variants_by_product_id = function(id){
		return $http.get('/api/products/'+id+'/variants');
	};
})

.service('orders', function($http){
	this.get_order_by_id = function(order_number, order_token){

		return $http.get('/api/orders/'+order_number+'/'+order_token);
	};

	this.addTocart = function(cartObject){
		var cart = {
		  order: {
		    line_items: [
		      { variant_id: cartObject.variant_id, quantity: 1 }
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

})

.service('countries',function($http){
	this.all = function(){
		return $http.get('/api/countries');
	}
})
//fileReader service
.factory('fileReader',["$q", "$log", function ($q, $log) {
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };

        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };

        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            return reader;
        };

        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();

            var reader = getReader(deferred, scope);
            reader.readAsDataURL(file);

            return deferred.promise;
        };

        return {
            readAsDataUrl: readAsDataURL
        };
    }])

.service('userManager',function($http, $q){
	this.login = function(user){
		console.log('user login..');
		var deferred = $q.defer();
		$http.post("/api/userManager/login", angular.toJson(user)).success(function(data){
			console.log(data)
			deferred.resolve(data);
		})
		.error(function(errData, errStatus, errHeaders, errConfig) {
			console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
		});
		return deferred.promise;
	}
	this.signup = function(user){
		console.log('user signup..');
		var deferred = $q.defer();
		$http.post("/api/userManager/signup", angular.toJson(user)).success(function(data){
			console.log(data)
			deferred.resolve(data);
		})
		.error(function(errData, errStatus, errHeaders, errConfig) {
			console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
		});
		return deferred.promise;
	}
})
//For demo
// .run(function(products) {
// 	products.getProductByID(17);
// })
