angular.module('luxire')
.service('products', function($http, $q, restApiService, AdminConstants){

	this.createVariants = function(productId,variant) {
		var deferred = $q.defer();
        var data=angular.toJson(variant);
		$http.post(AdminConstants.api.products+'/'+productId+"/variants", angular.toJson(variant)).success(function(res) {
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
		var deferred = $q.defer();
		$http.put(AdminConstants.api.products+'/'+productId+'/variants/'+variantId, angular.toJson(variantObj)).success(function(data) {
			deferred.resolve(data);
			})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
				deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
			});
			return deferred.promise;
	}

	this.allProductType= function(){
    var deferred = $q.defer();
    $http.get(AdminConstants.api.product_types).then(function(data){
      deferred.resolve(data)
      console.log(data);
    },function(errData, errStatus, errHeaders, errConfig){
      deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
    });
    return deferred.promise;
  }

	this.updateStock = function(id,inventoryObj) {
		var deferred = $q.defer();
		$http.put("/api/v1/admin/inventory/"+id, angular.toJson(inventoryObj)).success(function(data) {
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
		$http.get(AdminConstants.api.products+'/search?q[name_cont]='+search_phrase).then(function(data){
		deferred.resolve(data.data);
		},function(errData, errStatus, errHeaders, errConfig){
		deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
	});
	return deferred.promise;
	}
	//Edited on 20/05/16 for implementing scroll
	this.getProducts = function(page){
		var deferred = $q.defer();
		var url;
		if(page){
			url = AdminConstants.api.products +page;
		} else {
			url = AdminConstants.api.products;
		}
		$http.get(url).then(function(data){
			deferred.resolve(data)
		},function(errData, errStatus, errHeaders, errConfig){
			deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
		});
		return deferred.promise;

	}

	this.add_variant_image = function(product_id, variant_id, image){
		var fd = new FormData();
		fd.append('image', image);
		return $http.post(AdminConstants.api.products+'/'+product_id+'/variants/'+variant_id+'/images', fd, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': undefined}
	   });
 	};


	this.createProduct = function(product) {
		var deferred = $q.defer();
        var data=angular.toJson(product);
		$http.post(AdminConstants.api.products, angular.toJson(product)).success(function(res) {
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
		$http.get(AdminConstants.api.products+'/'+id).success(function(data) {
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
		var updateObj = {};
		updateObj['product'] = parameters.product;
		updateObj['product']['available_on'] = parameters.available_on;
		$http.put(AdminConstants.api.products+'/'+id,angular.toJson(updateObj)).success(function(data) {
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}

	//This service is used to create a new inventory

	this.createInventory =  function(data){
		var deferred = $q.defer();
		if(data.hasOwnProperty('in_house')){
			var inHouse = data.in_house;
		}
		else{
			var inHouse = false;
		}
		var postInventoryData = {
			stock_location_id : data.stockLocationId,
			parent_sku : data.sku,
			virtual_count_on_hands : data.luxireStock.quantity,
			physical_count_on_hands : data.luxireStock.quantity,
			measuring_unit : data.luxireStock.measuring_unit,
			backorderable : data.luxireStock.backorderable,
			rack : data.luxireStock.rack,
			threshold : data.luxireStock.threshold,
			in_house : inHouse,
			fabric_width : data.luxireStock.fabricWidth
		}
		$http.post('/api/v1/admin/inventory/createStocks',angular.toJson(postInventoryData)).success(function(data){
			console.log('success');
			deferred.resolve(data);
		})
		.error(function(data){
			console.log('error:',data);
			deferred.reject(data);
		});
		return deferred.promise;
	}

	this.deleteProduct = function(id) {
		var deferred = $q.defer();
		$http.delete(AdminConstants.api.products+'/'+id).success(function(data) {
			console.log(data);
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}
	//This service is used for uploading the variant image by image using variant id
	this.upload_image_variant = function(productId,variant_id,image){
		var deferred = $q.defer();
		var formData =  new FormData();
		formData.append('image',image);
		formData.append('variantId',variant_id);
		formData.append('productId',productId)
		$http.post(AdminConstants.api.addVariantImage, formData, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': undefined}}).success(function(data) {
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		 return deferred.promise;
	}
	//This service is used for uploading the variant image by image url using variant id
	this.upload_image_url_variant = function(productId,variant_id,image_url){
		var deferred = $q.defer();
		var  imageUploadUrlObject={
			productId: productId,
			variantId: variant_id,
			imageUrl: image_url
		}
		$http.post(AdminConstants.api.addVariantImageFromUrl, angular.toJson(imageUploadUrlObject)).success(function(data) {
			console.log(data);
			deferred.resolve(data);
  		})
			.error(function(errData, errStatus, errHeaders, errConfig) {
				console.log({data: errData,status: errStatus,headers: errHeaders,config: errConfig})
  			deferred.reject({data: errData,status: errStatus,headers: errHeaders,config: errConfig});
  		});
  		return deferred.promise;
	}
	//This service is used for deleteing the variant image by image url using variant id
	this.delete_variant_image = function(productId,id){
		var deferred = $q.defer();
		$http.delete(AdminConstants.api.deleteVariantImage+'/'+id+'?productId='+productId ).success(function(data) {
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
		//console.log('file in service', file);
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
.service('allTaxons', function($http,AdminConstants){

	this.getTaxonsPerPage= function(totalTaxons){
		if(totalTaxons == undefined){
			return $http.get(AdminConstants.api.allTaxons+'?without_children=true');
		}else{
			return $http.get(AdminConstants.api.allTaxons+'?without_children=true&per_page='+totalTaxons);
		}
	}


	this.searchTaxons= function(query){
		return $http.get(AdminConstants.api.allTaxons+'?q[name_cont]='+query);
	}

})
.service('CSV', function($http){

	this.upload = function(file){
		var fd = new FormData();
		fd.append('file', file);
		//console.log('file in service', file);
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
.service('luxireVendor', function($http,$q){
	this.getAllLuxireVendor= function(){
    //console.log("get all luxire vendor is calling...");
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

	this.checkParentSku = function(parentSku) {
		var deferred = $q.defer();
		$http.post("/api/luxire_stocks/validate_stocks_sku", angular.toJson(parentSku)).success(function(res) {
			deferred.resolve(res);
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
					var fd=new FormData();
					fd.append('file',fileContent);
					var deferred = $q.defer();
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
