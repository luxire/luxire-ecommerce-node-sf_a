angular.module('luxire')
.service('AdminOrderService', function($http){
  this.index = function(){
    return $http.get('/api/orders');
  };

})
