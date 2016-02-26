angular.module('luxire')
.controller('CartController',function($scope, $state, ImageHandler, $rootScope, $stateParams, orders){
  console.log('CartController params', $stateParams);
  $scope.product_quantity = 1;
  $scope.cartItems = [];
  var viewCartObj = {}
  var customize = []
  var personalise = []
  var measurement = []
  $rootScope.cart = [];
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  $scope.item_count = $rootScope.cart.length;
  angular.forEach($rootScope.cart, function(value, key){
    viewCartObj = {}
    customize = []
    personalise = []
    measurement = []
    angular.forEach(value, function(value, key){
        if(key != "Personalize" && key != "Measurement"){
          if (value != ""){
            viewCartObj[key] = value;
          }
        }
        else if(key == "Customize"){
          viewCartObj["Customize"] = value;
        }
        else if (key == "Personalize") {
          viewCartObj["Personalize"] = {};
          if(value["Monogram"]["selected"] == true){

            viewCartObj["Personalize"]["Monogram"] = value["Monogram"];
            delete viewCartObj["Personalize"]["Monogram"]["selected"];
          }
          viewCartObj["Personalize"]["Additional Options"] = value["Additional Options"];
          viewCartObj["Personalize"]["Contrast"] = value["Contrast"];

        }
        else if (key == "Measurement") {
          viewCartObj["Measurement"] = value;
          console.log(value);


        }

    });
    console.log(viewCartObj);
    $scope.cartItems.push(viewCartObj);
  });
  console.log($rootScope.cart);
  $scope.getCustomisationCost = function(total, actual){
    return (total-actual).toFixed(2);
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
