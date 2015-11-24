angular.module('luxire')
.controller('CheckoutDeliveryController',function($scope, $state, orders, $rootScope, $stateParams){
  var order_checkout_object = $stateParams.checkoutObject;
  $scope.shipments = $stateParams.checkoutObject.shipments[0];
  $scope.shipment_id = $scope.shipments.id;
  $scope.item_price = order_checkout_object.item_total;
  $scope.shipping_cost = 0;
  $scope.total_cost = $scope.item_price;
  $scope.selected_shipping_rate = order_checkout_object.selected_shipping_rate;
  console.log($scope.shipments);
  console.log($stateParams.checkoutObject);
  $scope.change_shipping_rate = function(selected_shipping_rate){
    $scope.shipping_cost = selected_shipping_rate.cost;
    $scope.total_cost = parseFloat($scope.item_price)+parseFloat($scope.shipping_cost);
    $scope.selected_shipping_rate_id = selected_shipping_rate.id;
    console.log(selected_shipping_rate);
  };
  $scope.proceed_to_checkout_payment = function(){
    orders.proceed_to_checkout_payment(order_checkout_object.number, $scope.shipment_id, $scope.selected_shipping_rate_id)
    .then(function(data){
      console.log(data);
      $state.go('checkout_payment', {checkoutObject: data.data});
    },function(error){
      console.error(error);
    });
  }
  // $scope.selected_shipping_rate = 'UPS One Day (USD)';
});
