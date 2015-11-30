angular.module('luxire')
.controller('CheckoutDeliveryController',function($scope, $state, orders, $rootScope, $stateParams){
  console.log($stateParams.checkoutObject);
  $scope.line_items = $stateParams.checkoutObject.line_items;
  $scope.display_item_total = $stateParams.checkoutObject.display_item_total;
  $scope.display_total = $stateParams.checkoutObject.display_total;
  $scope.adjustment_total = $stateParams.checkoutObject.adjustment_total.indexOf('-') !=-1 ? '-$'+$stateParams.checkoutObject.adjustment_total.split('-')[1] : '$'+$stateParams.checkoutObject.adjustment_total;
  $scope.shipping_total = $stateParams.checkoutObject.display_ship_total;
  $scope.shipping_address = $stateParams.checkoutObject.ship_address;

  var order_checkout_object = $stateParams.checkoutObject;
  $scope.shipments = $stateParams.checkoutObject.shipments[0];
  $scope.shipment_id = $scope.shipments.id;
  $scope.selected_shipping_rate = $scope.shipments.selected_shipping_rate;

  $scope.item_price = parseFloat(order_checkout_object.display_total.split('$')[1])-parseFloat($scope.selected_shipping_rate.cost);
  $scope.shipping_cost = 0;
  $scope.total_cost = $scope.item_price;
  console.log($scope.shipments);
  $scope.change_shipping_rate = function(selected_shipping_rate){
    $scope.shipping_cost = selected_shipping_rate.cost;
    $scope.total_cost = parseFloat($scope.item_price)+parseFloat($scope.shipping_cost);
    $scope.selected_shipping_rate_id = selected_shipping_rate.id;
    console.log(selected_shipping_rate);
  };
  $scope.proceed_to_checkout_payment = function(){
    var order_number = order_checkout_object.number;
    var order_token = order_checkout_object.token;
    orders.proceed_to_checkout_payment(order_number, order_token, $scope.shipment_id, $scope.selected_shipping_rate_id)
    .then(function(data){
      console.log(data);
      $state.go('checkout_payment', {checkoutObject: data.data});
    },function(error){
      console.error(error);
    });
  };
  function genhash(secret_key,account_id,amount,reference_no,return_url,mode)
  {
  	var genStr = secret_key + "|" + account_id + "|" + amount + "|" + reference_no + "|" +return_url + "|" + mode
  	var generatedhash = calcMD5(genStr)
  	return generatedhash
  }
  // $scope.selected_shipping_rate = 'UPS One Day (USD)';
});
