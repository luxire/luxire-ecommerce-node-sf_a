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
    console.log("productType",productType);
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
    console.log("update image service");
    console.log("image value passed",image);
    console.log("id passed",id);
  //  console.log('image', image);
   var fd = new FormData();
   fd.append('image', image);
   console.log("value appended");
   return $http.put(AdminConstants.api.product_types+'/'+id+'/images', fd, {
       transformRequest: angular.identity,
       headers: {'Content-Type': undefined}
    });
    console.log("end of update service");
 };

 /*-------*/
})
