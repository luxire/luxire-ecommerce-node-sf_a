angular.module('luxire')
/*Client ctrl instead of customer ctrl is used to
avoid conflict with customer ctrl on admin side*/
.controller('ClientController',function($scope, $rootScope, $state, CustomerOrders){
  console.log('customer controller');
  CustomerOrders.get_order_by_cookie().then(function(data){
    console.log('data from cookie', data);
    if(data.data === "null"){
      console.log("No order found");
      $rootScope.luxire_cart = {};
    }
    else{
      $rootScope.luxire_cart = data.data;
    }
  }, function(error){
    console.error(error);
  });
  // $rootScope.luxire_cart = angular.isUndefined($rootScope.luxire_cart)? {} : $rootScope.luxire_cart;
});
