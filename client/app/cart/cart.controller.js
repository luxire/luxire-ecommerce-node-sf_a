angular.module('luxire')
.controller('CartController',function($scope, $rootScope){
  $scope.cartItems = [];

  angular.forEach($rootScope.cart, function(value, key){
    var arr = []
    angular.forEach(value, function(value, key){
      if(angular.isObject(value)){
        // arr.push(value)
        angular.forEach(value,function(value,key){
          if (!angular.equals(value,"")){
            arr.push(key+': '+value);
          }
        });
      }
      else{
        arr.push(key+': '+value);

      };
    });
    $scope.cartItems.push(arr);

  });
  console.log($scope.cartItems);
})
