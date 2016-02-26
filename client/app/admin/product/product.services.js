angular.module('luxire')
.service('products', function($http, $q, restApiService){
	// autocomplete

	this.allProductType= function(){
    console.log("get all product  services is calling...");
    var deferred = $q.defer();
    $http.get('/api/v1/admin/product_types').then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

	this.updateStock = function(id,inventoryObj) {
		console.log("update stock is calling..");
		var deferred = $q.defer();
		console.log("inventory id: "+id);
		console.log("inventory obj: ",inventoryObj);
		$http.put("/luxire_stocks/"+id, angular.toJson(inventoryObj)).success(function(data) {
			deferred.resolve(data);
			})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
				deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
			});
			return deferred.promise;
	}

	this.searchProducts = function(search_phrase){
		var deferred = $q.defer();
		$http.get('/api/products?q[name_cont]='+search_phrase).then(function(data){
		deferred.resolve(data.data.products)
		},function(errData, errStatus, errHeaders, errConfig){
		deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
	});
	return deferred.promise;
	}

	//---------------
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
        var data=angular.toJson(product);
        console.log("*******product data is : \n\n"+data);
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



	this.editProduct = function(id, parameters) {
		var deferred = $q.defer();
		console.log("update product service is calling....");
		console.log("+++++++in services update product id: "+id);
		console.log("++++++in services update product parameter: ",parameters);

		$http.put("/api/products/"+id, angular.toJson(parameters)).success(function(data) {
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
.service('fileUpload', function($http){

	this.upload = function(file){
		var fd = new FormData();
		fd.append('file', file);
		console.log('file in service', file);
		$http.post('/files/csv', fd, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': undefined}
	   })
	   .success(function(data){
			 console.log(data);
	   })
	   .error(function(error){
			 console.error(error);
	   });
	};
})
.service('createProductModalService', function($http, $q){
	//Get all products
	this.checkParentSku = function(parentSku) {
		var deferred = $q.defer();
		console.log("check parent sku fun is calling...");
		$http.post("/luxire_stocks/validate_stocks_sku", angular.toJson(parentSku)).success(function(res) {
			console.log("parent sku :",res);
			deferred.resolve(res);
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
		.service('csvFileUpload', function($http, $q){
				this.uploadCsvFile = function(fileContent){
					console.log("csv file upload service is calling with ...\n",fileContent);
					var fd=new FormData();
					fd.append('file',fileContent);
					var deferred = $q.defer();
					console.log('______________________________________');
					//console.log('fileContent', {data : fileContent});
					console.log('______________________________________');
					$http.post("/csvUploadFile", fd,{
		             transformRequest: angular.identity,
		             headers: {'Content-Type': undefined}
		        }).success(function(res) {
								console.log("response from node in csv file upload : ",res);
						deferred.resolve(res.data);
						})
						.error(function(errData, errStatus, errHeaders, errConfig) {
							console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
							deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
						});
						return deferred.promise;
				}
		})
		.service('editModalService', function($http, $q ){
			//Get all products
			this.checkParentSku = function(parentSku) {
				var deferred = $q.defer();
				console.log("check parent sku fun is calling...");
				$http.post("/luxire_stocks/validate_stocks_sku", angular.toJson(parentSku)).success(function(res) {
					console.log("parent sku :",res);
					deferred.resolve(res);
					})
					.error(function(errData, errStatus, errHeaders, errConfig) {
						console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
						deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
					});
					return deferred.promise;
			}

			this.updateStock = function(id,inventoryObj) {
				var deferred = $q.defer();
				$http.put("/luxire_stocks/"+id, angular.toJson(inventoryObj)).success(function(data) {
					deferred.resolve(data);
		  		})
					.error(function(errData, errStatus, errHeaders, errConfig) {
						console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
		  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
		  		});
		  		return deferred.promise;
			}

		})
