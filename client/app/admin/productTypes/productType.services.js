angular.module('luxire')
.service('productTypeService', function($http,$q, AdminConstants){
  //Get all product Attributes

  this.getProductTypes = function(){
    console.log('get all products', AdminConstants.api.product_types);
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
    console.log(productType);
		return $http.put(AdminConstants.api.product_types+"/"+id, angular.toJson(productType));
	}

  this.getMeasurementTypes = function(){
  	return $http.get(AdminConstants.api.measurement_types);
  }
  this.getProductTypeById= function(id){
    return $http.get(AdminConstants.api.product_types+"/"+id);
  }
})
