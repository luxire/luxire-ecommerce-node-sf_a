angular.module('luxire')
.controller('CartController',function($scope, $state, $rootScope, $stateParams){
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
          viewCartObj["Personalize"] = {}
          if(value["Monogram"]["selected"] == true){

            viewCartObj["Personalize"]["Monogram"] = value["Monogram"]
            delete viewCartObj["Personalize"]["Monogram"]["selected"]
          }
          viewCartObj["Personalize"]["Additional Options"] = value["Additional Options"]
          viewCartObj["Personalize"]["Contrast"] = value["Contrast"]

        }
        else if (key == "Measurement") {
          viewCartObj["Measurement"] = value
          console.log(value)


        }

    });
    $scope.cartItems.push(viewCartObj);
    // $scope.cartItems.push(angular.toJson(value, true));
  });
  console.log($rootScope.cart);
  $scope.getCustomisationCost = function(total, actual){
    return (total-actual).toFixed(2);
  };
  $scope.gotoCheckout = function(){
    $state.go('checkout_address')
  }
})
