angular.module('luxire')
.service('styleMasterService',function($http, $q, AdminConstants){

  //Get all products
  this.getAllProductType= function(){
    return $http.get(AdminConstants.api.product_types);
  }
  this.getAllMeasurementType= function(){
    return $http.get(AdminConstants.api.measurement_types);
  }

  this.getProductTypeById= function(productTypeId){
    return $http.get(AdminConstants.api.product_types+'/'+productTypeId);
  }

  this.createStyleMaster = function(styleMasterObj) {
    console.log("In create service", angular.toJson(styleMasterObj));
    return $http.post(AdminConstants.api.style_masters, angular.toJson(styleMasterObj));
    console.log("end of create service");
  }

  this.getAllStyleMaster= function(){
    console.log('get all style masters');
    return $http.get(AdminConstants.api.style_masters);
  };

  this.getStyleMasterById= function(styleMasterId){
    return $http.get(AdminConstants.api.style_masters+'/'+styleMasterId);
  }

  this.deleteStyleMaster = function(id) {
    return $http.delete(AdminConstants.api.style_masters+'/'+id);
  }

  this.updateStyleMasterById = function(id,updatedObj) {

    return $http.put(AdminConstants.api.style_masters+'/'+id,angular.toJson(updatedObj));
  }
  /*upload image*/

  this.update_image = function(image, id){
    console.log("update image service");
   console.log('image', image);
   var fd = new FormData();
   fd.append('image', image);
   console.log("value appended");
   return $http.put(AdminConstants.api.style_masters+'/'+id+'/images', fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    });
    console.log("end of update service");
 };

 /*-------*/

})
.service('productSearch', function($http, $q){

  this.searchProducts = function(search_phrase){
		var deferred = $q.defer();
		$http.get('/api/products?q[name_cont]='+search_phrase).then(function(data){
		deferred.resolve(data.data.products)
		},function(errData, errStatus, errHeaders, errConfig){
		deferred.reject({data: errData , status: errData.status ,headers: errData.headers ,config: errData.config});
	});
	return deferred.promise;
	}

})
