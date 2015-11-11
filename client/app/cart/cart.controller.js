angular.module('luxire')
.controller('CartController',function($scope, $state, $rootScope, $stateParams){
  $scope.cartItems = [];

  angular.forEach($rootScope.cart, function(value, key){
    // var arr = []
    // angular.forEach(value, function(value, key){
    //     arr.push(key value);
    // });
    $scope.cartItems.push(JSON.stringify(value, null, 2));
  });
  console.log($scope.cartItems);
})
