angular.module('luxire')
.controller('checkoutPaymentController',function($scope, $state, orders, $rootScope, $stateParams){
  console.log($stateParams.checkoutObject);
  var checkoutObject = $stateParams.checkoutObject;
  var bill_address = $stateParams.checkoutObject.bill_address;
  var ship_address = $stateParams.checkoutObject.ship_address;
  $scope.item_cost = $stateParams.checkoutObject.display_item_total;
  $scope.shipment_cost = $stateParams.checkoutObject.display_ship_total;
  $scope.total_cost = $stateParams.checkoutObject.display_total;

  $scope.name_on_card = 'Test'
  $scope.card_number = '4111111111111111'
  $scope.card_expiry = '07/16'
  $scope.card_cvv = '123'


  $scope.proceed_to_checkout_gateway = function(){
    var ebs_object = {
      vpc_ReferenceNo: checkoutObject.number,
      vpc_Amount: parseFloat(checkoutObject.total),
      vpc_Mode: 'TEST',
      vpc_Description: 'luxire',
      vpc_Name: bill_address.full_name || '',
      vpc_Address: bill_address.address1 || '',
      vpc_City: bill_address.city || '',
      vpc_State: bill_address.state.name || '',
      vpc_PostalCode: bill_address.zipcode || '',
      vpc_Country: bill_address.country.iso3 || '',
      vpc_Email: bill_address.email || '',
      vpc_Phone: bill_address.PHONE || '',
      vpc_ShipName: ship_address.full_name || '',
      vpc_ShipAddress: ship_address.address1 || '',
      vpc_ShipCity: ship_address.city || '',
      vpc_ShipState: ship_address.state.name || '',
      vpc_ShipPostalCode: ship_address.zipcode || '',
      vpc_ShipCountry: ship_address.country.iso3 || '',
      vpc_PaymentOption: 'credit',
      vpc_CardNo: $scope.card_number,
      vpc_ExpiryDate: $scope.card_expiry,
      vpc_Cvv: $scope.card_cvv,
      vpc_Issuingbank: 'EBS',
      vpc_ReturnUrl: '',
      vpc_GoBackUrl: '',

    };
    orders.proceed_to_checkout_gateway(checkoutObject.number, ebs_object).then(function(data){
      console.log(data);
      $state.go('checkout_gateway',{gatewayObject: data.data});
    },
    function(error){
      console.error(error);
    });
  };







})
