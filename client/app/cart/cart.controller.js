angular.module('luxire')
.controller('CartController',function($scope, $state, $rootScope, $stateParams, orders){
  $scope.product_quantity = 1;
  $scope.cartItems = [];
  var viewCartObj = {}
  var customize = []
  var personalise = []
  var measurement = []

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
    orders.proceed_to_checkout(order_number).then(function(data){
      $state.go('checkout_address');
      console.log(data);
    },function(error){
      console.error(error);
    })
  }
  $scope.go_to_checkout_address = function(quantity){
    order_number = $rootScope.cart[0].checkoutObject.number;
    line_item_id = $rootScope.cart[0].checkoutObject.line_items[0].id;
    variant_id = $rootScope.cart[0].checkoutObject.line_items[0].variant_id;

    if($rootScope.cart[0].checkoutObject.line_items[0].quantity != quantity){
      orders.update_cart_by_quantity(order_number,line_item_id,variant_id,quantity).then(function(data){
          proceed_to_checkout(order_number);
          console.log(data);
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
