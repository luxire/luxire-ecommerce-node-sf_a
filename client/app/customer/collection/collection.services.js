angular.module('luxire')
.service('CollectionService', function($http, CustomerConstants){
  this.products = function(){
    return $http.get(CustomerConstants.api.products);
  }
})
