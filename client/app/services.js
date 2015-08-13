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
.service('products', function($http, $q){
	var authToken = "99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058";
	var baseURL = "http://54.169.41.36:3000";
	// this.getProducts = function() {
	// 	var deferred = $q.defer();
	// 	$http.get(baseURL + "/api/products.json?token=" + authToken).success(function(data) {
	// 		deferred.resolve(data);
  // 		})
  // 		.error(function(data, status, headers, config) {
  // 			deferred.reject("Data: " + data + "Status: " + " " + status + "Headers: " + headers + "Config: " + config);
  // 		});
  // 		return deferred.promise;
	// }
	this.getProducts = function(){
		console.log('Calling api'+Date.now())
		var deferred = $q.defer();
		$http.get('/api/products').then(function(data){
			console.log('Object received at'+Date.now())
			deferred.resolve(data);
		},function(data, status, headers, config){
			deferred.reject({data: errData , status: errStatus ,headers: errHeaders ,config: errConfig});
		});
		return deferred.promise;
	}


	this.getProductByID = function(id) {
		var deferred = $q.defer();
		$http.get(baseURL + "/api/products?token=" + authToken + "&q[id_eq]=" + id).success(function(data) {
			deferred.resolve(data);
  		})
  		.error(function(data, status, headers, config) {
  			deferred.reject("Data: " + data + "Status: " + " " + status + "Headers: " + headers + "Config: " + config);
  		});
  		return deferred.promise;
	}

	this.createProduct = function(prodName, prodPrice, prodShippingCategory) {
		var deferred = $q.defer();
		var parameters = {
			token: authToken,
			product: {
				name: prodName,
				price: prodPrice,
				shipping_category: prodShippingCategory
			}
		}
		$http.post(baseURL + "/api/products", angular.toJson(parameters)).success(function(data) {
			deferred.resolve(data);
  		})
  		.error(function(data, status, headers, config) {
  			console.log(data);
  			deferred.reject("Data: " + data + " Status: " + " " + status + " Headers: " + headers + " Config: " + config);
  		});
  		return deferred.promise;
	}

	this.updateProduct = function(id, prod_parameters) {
		var deferred = $q.defer();
		var parameters = {
			token: authToken,
			product: prod_parameters
		}
		$http.put(baseURL + "/api/products/" + id, angular.toJson(parameters)).success(function(data) {
			deferred.resolve(data);
  		})
  		.error(function(data, status, headers, config) {
  			console.log(data);
  			deferred.reject("Data: " + data + " Status: " + " " + status + " Headers: " + headers + " Config: " + config);
  		});
  		return deferred.promise;
	}

	this.deleteProduct = function(id) {
		var deferred = $q.defer();
		console.log(baseURL + "/api/products/" + id + "?token=" + authToken);
		$http.delete(baseURL + "/api/products/" + id + "?token=" + authToken).success(function(data) {
			deferred.resolve(data);
  		})
  		.error(function(data, status, headers, config) {
  			deferred.reject("Data: " + data + "Status: " + " " + status + "Headers: " + headers + "Config: " + config);
  		});
  		return deferred.promise;
	}
})

//For demo
.run(function(products) {
	products.getProductByID(17);
})
