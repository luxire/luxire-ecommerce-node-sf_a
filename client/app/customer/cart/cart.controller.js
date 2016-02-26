angular.module('luxire')
.controller('CustomerCartController',function($scope, $state, ImageHandler, $rootScope, $stateParams, orders){
  console.log('CartController params', $stateParams);
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  var updated_line_items = [];
  $scope.update_cart = function(line_items){
      console.log(line_items);
      angular.forEach(line_items, function(val, key){
        orders.update_cart_by_quantity($rootScope.luxire_cart.number, $rootScope.luxire_cart.token, val.id, val.variant_id, val.quantity)
        .then(function(data){
          console.log(data.data);
          $rootScope.alerts.push({type: 'success', message: 'Cart updated successfully'});

        }, function(error){
          $rootScope.alerts.push({type: 'danger', message: 'Failed to update cart'});

          console.error(error);
        })
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
    $state.go('customer.checkout_address');
  };

  var proceed_to_checkout = function(order_number){
    console.log(order_number);
    orders.proceed_to_checkout(order_number, $rootScope.cart[0].checkoutObject.token).then(function(data){
      $state.go('checkout_address',{checkoutObject: $rootScope.cart[0].checkoutObject});
      console.log(data);
    },function(error){
      $state.go('checkout_address',{checkoutObject: $rootScope.cart[0].checkoutObject});
      console.error(error);
    })
  }
  $scope.go_to_checkout_address = function(quantity){
    console.log('Quantity in response', $rootScope.cart[0].checkoutObject.line_items[0].quantity);
    console.log('quantity in params', quantity);
    order_number = $rootScope.cart[0].checkoutObject.number;
    order_token = $rootScope.cart[0].checkoutObject.token;
    line_item_id = $rootScope.cart[0].checkoutObject.line_items[0].id;
    variant_id = $rootScope.cart[0].checkoutObject.line_items[0].variant_id;

    if($rootScope.cart[0].checkoutObject.line_items[0].quantity != quantity){
      orders.update_cart_by_quantity(order_number, order_token, line_item_id,variant_id,quantity).then(function(data){
        orders.get_order_by_id(order_number, $rootScope.cart[0].checkoutObject.token).then(function(data){
          console.log('updated order',data.data);
          $rootScope.cart[0].checkoutObject = data.data;
          proceed_to_checkout(order_number);
        }, function(error){
          console.error(error);
        });
          // $rootScope.cart[0].checkoutObject.line_items[0] = data.data;
          console.log(data);
          // proceed_to_checkout(order_number);

      },function(error){
        console.error(error);
      });
    }
    else{
      proceed_to_checkout(order_number);
    }

    //$state.go('checkout_address')
  }
})
