angular.module('luxire')
.controller('CheckoutController',function($scope, $state, $rootScope, $stateParams){
  var shipping_address = $stateParams.checkoutObject.ship_address
  $scope.order_total = '$'+$stateParams.checkoutObject.total
  console.log(shipping_address);
  console.log($stateParams.checkoutObject);
  /*Billing address*/
  $scope.billing = {};
  $scope.shipping = {
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    zipcode: '',
    phone: '',
    country_id: '',
    state_id: ''
  };
  angular.forEach($scope.shipping, function(value, key){
    if (key == 'country'){
      $scope.shipping[key] = shipping_address.country.iso_name
    }
    else if(key == 'state'){
      $scope.shipping[key] = shipping_address.state.name
    }
    else{
      $scope.shipping[key] = shipping_address[key]
    }
  });

  console.log($scope.shipping)

})
