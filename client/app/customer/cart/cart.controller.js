angular.module('luxire')
.controller('CustomerCartController',function($scope, $state, ImageHandler, $rootScope, $stateParams, CustomerOrders, orders){
  console.log('CartController params', $stateParams);
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  var updated_line_items = [];
  $scope.update_cart = function(line_items){
      console.log(line_items);
      angular.forEach(line_items, function(val, key){
        CustomerOrders.update_cart_by_quantity($rootScope.luxire_cart, val.id, val.variant_id, val.quantity)
        .then(function(data){
          console.log(data.data);
        }, function(error){
          console.error(error);
        })
  });
  CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
    $rootScope.luxire_cart = data.data;
    $rootScope.alerts.push({type: 'success', message: 'Cart updated successfully'});
  }, function(error){
    $rootScope.alerts.push({type: 'danger', message: 'Failed to update cart'});
    console.error(error);
  });


    // console.log(line_items);
    // updated_line_items = [];
    // angular.forEach(line_items, function(val, key){
    //   updated_line_items.push({variant_id: val.variant_id,quantity: val.quantity});
    // });
    // orders.update_cart_by_quantity($rootScope.luxire_cart.number, $rootScope.luxire_cart.token, updated_line_items)
    // .then(function(data){
    //   console.log(data.data);
    // }, function(error){
    //   console.error(error);
    // });
  };

  $scope.checkout = function(){
    console.log('proceed_to_checkout');
    console.log($rootScope.luxire_cart);
    CustomerOrders.proceed_to_checkout($rootScope.luxire_cart)
    .then(function(data){
      $state.go('customer.checkout_address');
      console.log(data);
    }, function(error){
      console.error(error);
    })
  };

})
