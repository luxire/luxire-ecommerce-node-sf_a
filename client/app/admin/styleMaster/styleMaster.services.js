angular.module('luxire')
.service('styleMasterService',function($http, $q, AdminConstants){
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
    return $http.post(AdminConstants.api.style_masters, angular.toJson(styleMasterObj));
  }

  this.getAllStyleMaster= function(){
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
   var fd = new FormData();
   fd.append('image', image);
   return $http.put(AdminConstants.api.style_masters+'/'+id+'/images', fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    });
  };

  this.upload_new_detail_image = function(image_object){
    var fd = new FormData();
    angular.forEach(image_object, function(value, key){
      fd.append(key, value)
    });
    return $http.post(AdminConstants.api.style_masters+'/'+image_object.luxire_style_master_id+'/style_detail_images', fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    });
  };

  this.delete_detail_image = function(style_id, image_id){
    return $http.delete(AdminConstants.api.style_masters+'/'+style_id+'/style_detail_images/'+image_id);
  };

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
