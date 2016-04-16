angular.module('luxire')
.service('standardSizeService', function($http,$q, AdminConstants){


  this.getAllStandardSize = function(){
    console.log('AdminConstants:', AdminConstants);
    console.log('get all std_sizes', AdminConstants.api.standard_size);
		return $http.get(AdminConstants.api.standard_size);
	}


  this.deleteStandardSizeById = function(id) {
    return $http.delete(AdminConstants.api.standard_size+"/"+id);
  }

  this.createStandardSize = function(stdSize) {
    console.log(stdSize);
		return $http.post(AdminConstants.api.standard_size, angular.toJson(stdSize));
	}


  this.updateStandardSizeById = function(id,stdSize) {
    console.log("stdSize",stdSize);
		 return $http.put(AdminConstants.api.standard_size+"/"+id, angular.toJson(stdSize));
	}


  this.getStandardSizeById= function(id){
    return $http.get(AdminConstants.api.standard_size+"/"+id);
  }

  this.allProductType= function(){
    return $http.get('/api/v1/admin/product_types')
  }
})
