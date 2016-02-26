angular.module('luxire')
.service('ProductListingService', function($http, CustomerConstants){
  this.products = function(){
    return $http.get(CustomerConstants.api.products);
  }
})
