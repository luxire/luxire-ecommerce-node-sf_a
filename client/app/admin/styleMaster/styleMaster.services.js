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
    console.log('styleMasterObj', styleMasterObj);
		var fd = new FormData();
    fd.append('name', styleMasterObj.name);
    fd.append('help', styleMasterObj.help);
    fd.append('default_values', angular.toJson(styleMasterObj.default_values));
    fd.append('luxire_product_type', angular.toJson(styleMasterObj.luxire_product_type));
    if(styleMasterObj.image && angular.isObject(styleMasterObj.image)){
      fd.append('image', styleMasterObj.image);
    }
    console.log('fd', fd);
    return $http.post(AdminConstants.api.style_masters, fd, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': undefined}
	   });
    // return $http.post(AdminConstants.api.style_masters, angular.toJson(styleMasterObj));
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
    console.log('updatedObj', updatedObj);
		var fd = new FormData();
    fd.append('id', updatedObj.id);
    fd.append('name', updatedObj.name);
    fd.append('help', updatedObj.help);
    fd.append('default_values', angular.toJson(updatedObj.default_values));
    fd.append('luxire_product_type', angular.toJson(updatedObj.luxire_product_type));
    if(updatedObj.image && angular.isObject(updatedObj.image)){
      fd.append('image', updatedObj.image);
    }
    console.log('fd', fd);
		return $http.put(AdminConstants.api.style_masters+'/'+id, fd, {
	      transformRequest: angular.identity,
	      headers: {'Content-Type': undefined}
	   });
    // return $http.put(AdminConstants.api.style_masters+'/'+id,angular.toJson(updatedObj));
  }
})
