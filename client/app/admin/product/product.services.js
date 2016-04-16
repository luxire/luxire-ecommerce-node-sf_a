angular.module('luxire')
.service('products', function($http, $q, restApiService){

	this.createVariants = function(productId,variant) {
		console.log("create variants in client service is calling...");
		var deferred = $q.defer();
        var data=angular.toJson(variant);
        console.log("*******variant data is : \n\n"+data);
		$http.post("/api/products/"+productId+"/variants", angular.toJson(variant)).success(function(res) {
			console.log(res);
			deferred.resolve(res.data);
  		})
  		.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}

	this.updateVariants = function(productId,variantId,variantObj) {
		console.log("update variants is calling..");
		var deferred = $q.defer();
		console.log("product id: "+productId);
		console.log("variant id: ",variantId);
		console.log("variant obj: ",variantObj);

		$http.put("/api/products/"+productId+'/variants/'+variantId, angular.toJson(variantObj)).success(function(data) {
			deferred.resolve(data);
			})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
				deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
			});
			return deferred.promise;
	}

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
		$http.put("/api/luxire_stocks/"+id, angular.toJson(inventoryObj)).success(function(data) {
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


	this.getProducts = function(){
		var deferred = $q.defer();
		$http.get('/api/products').then(function(data){
			deferred.resolve(data)
		},function(errData, errStatus, errHeaders, errConfig){
			deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
		});
		return deferred.promise;
	}

	this.add_variant_image = function(product_id, variant_id, image){
		console.log('product_id', product_id);
		console.log('variant_id', variant_id);
		console.log('image', image);
		var fd = new FormData();
		fd.append('image', image);
		return $http.post('/api/v1/admin/products/'+product_id+'/variants/'+variant_id+'/images', fd, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': undefined}
	   });
 	};


	this.createProduct = function(product) {
		var deferred = $q.defer();
        var data=angular.toJson(product);
        console.log("*******product data is : \n\n"+data);
		$http.post("/api/products", angular.toJson(product)).success(function(res) {
			console.log(res);
			deferred.resolve(res);
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
.service('CSV', function($http){

	this.upload = function(file){
		var fd = new FormData();
		fd.append('file', file);
		console.log('file in service', file);
		return $http.post('/api/v1/admin/products/csv', fd, {
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
.service('allTaxons', function($http,AdminConstants){

	this.getTaxonsPerPage= function(totalTaxons){
		if(totalTaxons == undefined){
			return $http.get(AdminConstants.api.allTaxons+'?without_children=true');
		}else{
			return $http.get(AdminConstants.api.allTaxons+'?without_children=true&per_page='+totalTaxons);
		}
	}


	this.getAllTaxons= function(){
		return $http.get(AdminConstants.api.allTaxons);
	}

})
.service('luxireVendor', function($http,$q){
	this.getAllLuxireVendor= function(){
    console.log("get all luxire vendor is calling...");
    var deferred = $q.defer();
    $http.get('/api/luxire_vendor_masters').then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }


})
.service('createProductModalService', function($http, $q){
	//Get all products
	console.log("parent sku check fun is calling in client services...");
	this.checkParentSku = function(parentSku) {
		var deferred = $q.defer();
		console.log("check parent sku fun is calling...");
		$http.post("/api/luxire_stocks/validate_stocks_sku", angular.toJson(parentSku)).success(function(res) {
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
		.service('editModalService', function($http, $q ){
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
