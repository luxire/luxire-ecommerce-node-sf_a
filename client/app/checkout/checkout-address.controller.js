angular.module('luxire')
.controller('CheckoutAddressController',function($scope, $state, orders, countries, $rootScope, $stateParams){
  console.log($stateParams.checkoutObject.ship_address);
  var shipping_address = $stateParams.checkoutObject.ship_address;
  $scope.shipping = {
    firstname: '',
    lastname: '',
    address1: '',
    city: '',
    phone: '',
    zipcode: '',
    state_id: 0,
    country_id: 0
  };

  angular.forEach($scope.shipping, function(value, key){
      $scope.shipping[key] = shipping_address[key]
   });

  $scope.countries = [];
  $scope.states = [];

  $scope.order_total = '$'+$stateParams.checkoutObject.total;

  countries.all().then(function(data){
    console.log('countries',data);
    $scope.countries = data.data;
    $scope.states = $scope.shipping.country_id == null ? [] : $scope.countries[$scope.shipping.country_id-1].states
  },function(error){
    console.log('error',error);
  });

  $scope.populate_states = function(country_id){
    console.log(country_id);
    $scope.states = $scope.countries[country_id -1].states;
  };

  $scope.proceed_to_checkout_delivery = function(){
    order_address = {
      order: {
        bill_address_attributes: $scope.shipping,
        ship_address_attributes: $scope.shipping
      }
    };
    console.log(order_address);
    orders.proceed_to_checkout_delivery($stateParams.checkoutObject.number,order_address)
    .then(function(data){
      console.log(data);
      $state.go('checkout_delivery',{checkoutObject: data.data});
    },function(error){
      console.log(error);
    });
  };
  // var shipping_address = $stateParams.checkoutObject.ship_address
  // console.log(shipping_address);
  // console.log($stateParams.checkoutObject.number);
  // /*Billing address*/
  // $scope.billing = {};
  // $scope.shipping = {
  //   firstname: '',
  //   lastname: '',
  //   address1: '',
  //   address2: '',
  //   city: '',
  //   country: "",
  //   state: '',
  //   zipcode: '',
  //   phone: '',
  //   country_id: 232,
  //   state_id: 3545
  // };
  // var order_address = {
  //   order: {
  //     bill_address_attributes: {
  //       firstname: "",
  //       lastname: "",
  //       address1: "",
  //       city: "",
  //       phone: "",
  //       zipcode: "",
  //       country: "",
  //       state_id: -1,
  //       country_id: -1
  //     },
  //     ship_address_attributes: {
  //       firstname: "",
  //       lastname: "",
  //       address1: "",
  //       city: "",
  //       phone: "",
  //       zipcode: "",
  //       country: "United States",
  //       state_id: -1,
  //       country_id: -1
  //     }
  //   }
  // }
  // angular.forEach($scope.shipping, function(value, key){
  //   if (key == 'country'){
  //     $scope.shipping[key] = shipping_address.country.iso_name
  //   }
  //   else if(key == 'state'){
  //     $scope.shipping[key] = shipping_address.state.name
  //   }
  //   else{
  //     $scope.shipping[key] = shipping_address[key]
  //   }
  // });
  // $scope.proceed_to_checkout_delivery = function(){
  //   order_address = {
  //     order: {
  //       bill_address_attributes: $scope.shipping,
  //       ship_address_attributes: $scope.shipping
  //     }
  //   };
  //   orders.proceed_to_checkout_delivery($stateParams.checkoutObject.number,order_address)
  //   .then(function(data){
  //     console.log(data);
  //   },function(error){
  //     console.log(error);
  //   });
  // };
  //
  // console.log($scope.shipping)

})
