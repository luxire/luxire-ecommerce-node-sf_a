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
	this.createProduct = function(prodName, prodPrice, prodShippingCategory, prodImage) {
		var deferred = $q.defer();
		var parameters = {
			product: {
				name: prodName,
				price: prodPrice || 10,
				shipping_category_id: prodShippingCategory,
				image: prodImage || '',
				variants: [
					{
					id: 85,
					name: "Ruby on Rails Baseball Jersey",
					sku: "ROR-000023",
					price: "19.99",
					weight: "0.0",
					height: null,
					width: null,
					depth: null,
					is_master: false,
					slug: "ruby-on-rails-baseball-jersey",
					description: "Magni iure laudantium saepe rerum expedita. Est veritatis iusto voluptate quasi voluptatem. Unde quasi aperiam sit omnis reiciendis. Et ea corrupti quia natus dignissimos perspiciatis fuga ut. Optio adipisci labore inventore hic.",
					track_inventory: true,
					cost_price: "17.0",
					display_price: "$19.99",
					options_text: "Size: S, Color: Red",
					in_stock: true,
					is_backorderable: true,
					total_on_hand: 10,
					is_destroyed: false

					}
				]
			}
		}
		$http.post("/api/products", angular.toJson(parameters)).success(function(res) {
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


//For demo
.run(function(products) {
	products.getProductByID(17);
})
