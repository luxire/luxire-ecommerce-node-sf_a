angular.module('luxire')
.service('productTypeService', function($http,$q, AdminConstants){
  //Get all product types
  this.getProductTypes = function(){
		return $http.get(AdminConstants.api.product_types);
	}

  this.deleteProductType = function(id) {
    return $http.delete(AdminConstants.api.product_types+"/"+id);
  }

  this.createProductType = function(productType) {
    console.log(productType);
		return $http.post(AdminConstants.api.product_types, angular.toJson(productType));
	}

  this.updateProductType = function(id,productType) {
		 return $http.put(AdminConstants.api.product_types+"/"+id, angular.toJson(productType));
	}

  this.getMeasurementTypes = function(){
  	return $http.get(AdminConstants.api.measurement_types);
  }

  this.getProductTypeById= function(id){
    return $http.get(AdminConstants.api.product_types+"/"+id);
  }
  /*upload image*/
  this.update_image = function(image, id){
   var fd = new FormData();
   fd.append('image', image);
   return $http.put(AdminConstants.api.product_types+'/'+id+'/images', fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    });
  };
 /*-------*/
})
