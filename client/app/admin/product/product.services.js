angular.module('luxire')
.service('products', function($http, $q){
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
	this.createProduct = function(product) {
		var deferred = $q.defer();
		var prod = {
			product: product
		};
		console.log('creating product', prod);
		$http.post("/api/products", angular.toJson(prod)).success(function(res) {
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
