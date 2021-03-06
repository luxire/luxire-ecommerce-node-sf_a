angular.module('luxire')
.service('AdminConstants',function(){
	this.api = {
		host: 'https://luxire-store.cloudhop.in',
		products: '/api/v1/admin/products',
		product_types: '/api/v1/admin/product_types',
		measurement_types: '/api/v1/admin/measurement_types',//product attributes
		style_masters: '/api/v1/admin/style_masters',
		standard_size: '/api/v1/admin/standard_size',
		allTaxons: '/api/v1/admin/allTaxons',
		orders: '/api/v1/admin/orders',
		inventory: '/api/v1/admin/inventory',
		addVariantImageFromUrl: '/api/v1/admin/image/addImageFromUrl',//adding the variant image using url
		addVariantImage: '/api/v1/admin/image/addImage',//adding the variant image using the image
		deleteVariantImage: '/api/v1/admin/image/deleteImage'//deleting the variant image 
	};
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
