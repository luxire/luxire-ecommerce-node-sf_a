angular.module('luxire')
.controller('CheckoutController',function($scope, $state, orders, $rootScope, $stateParams){
  var shipping_address = $stateParams.checkoutObject.ship_address
  $scope.order_total = '$'+$stateParams.checkoutObject.total
  console.log(shipping_address);
  console.log($stateParams.checkoutObject.number);
  /*Billing address*/
  $scope.billing = {};
  $scope.shipping = {
    firstname: '',
    lastname: '',
    address1: '',
    address2: '',
    city: '',
    country: "",
    state: '',
    zipcode: '',
    phone: '',
    country_id: 232,
    state_id: 3545
  };
  var order_address = {
    order: {
      bill_address_attributes: {
        firstname: "",
        lastname: "",
        address1: "",
        city: "",
        phone: "",
        zipcode: "",
        country: "",
        state_id: -1,
        country_id: -1
      },
      ship_address_attributes: {
        firstname: "",
        lastname: "",
        address1: "",
        city: "",
        phone: "",
        zipcode: "",
        country: "United States",
        state_id: -1,
        country_id: -1
      }
    }
  }
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
  $scope.proceed_to_checkout_delivery = function(){
    order_address = {
      order: {
        bill_address_attributes: $scope.shipping,
        ship_address_attributes: $scope.shipping
      }
    };
    orders.proceed_to_checkout_delivery($stateParams.checkoutObject.number,order_address)
    .then(function(data){
      console.log(data);
    },function(error){
      console.log(error);
    });
  };

  console.log($scope.shipping)

})
