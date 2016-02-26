angular.module('luxire')
/*Client ctrl instead of customer ctrl is used to
avoid conflict with customer ctrl on admin side*/
.controller('ClientController',function($scope, $rootScope, $state, CustomerOrders){
  CustomerOrders.get_order_by_cookie().then(function(data){
    console.log('data from cookie', data);
  }, function(error){
    console.error(error);
  });
  $rootScope.luxire_cart = angular.isUndefined($rootScope.luxire_cart)? {} : $rootScope.luxire_cart;
});
