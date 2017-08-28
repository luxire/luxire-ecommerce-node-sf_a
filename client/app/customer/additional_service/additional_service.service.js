angular.module('luxire')
.service('AdditionalService', function($http, CustomerConstants){
  this.getAdditionalServiceProduct = function(){
      return $http.get(CustomerConstants.api.additionalService);
  }
});