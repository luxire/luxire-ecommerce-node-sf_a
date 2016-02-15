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
    return $http.post(AdminConstants.api.style_masters, angular.toJson(styleMasterObj));
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
})
