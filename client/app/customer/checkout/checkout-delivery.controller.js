angular.module('luxire')
.controller('CustomerCheckoutDeliveryController',function($scope, $rootScope, $state, orders, $rootScope, $stateParams, ImageHandler, CustomerOrders, $window){
  $window.scrollTo(0, 0);
  console.log($rootScope.luxire_cart);
  $scope.line_items = $rootScope.luxire_cart.line_items;
  $scope.display_item_total = $rootScope.luxire_cart.display_item_total;
  $scope.display_total = $rootScope.luxire_cart.display_total;
  $scope.adjustment_total = $rootScope.luxire_cart.adjustment_total.indexOf('-') !=-1 ? '-$'+$rootScope.luxire_cart.adjustment_total.split('-')[1] : '$'+$rootScope.luxire_cart.adjustment_total;
  $scope.shipping_total = $rootScope.luxire_cart.display_ship_total;
  $scope.shipping_address = $rootScope.luxire_cart.ship_address;

  var order_checkout_object = $rootScope.luxire_cart;
  $scope.shipments = $rootScope.luxire_cart.shipments[0];
  $scope.shipment_id = $scope.shipments.id;
  $scope.selected_shipping_rate = $scope.shipments.selected_shipping_rate;
  $scope.selected_shipping_rate_id = $scope.shipments.selected_shipping_rate.id;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  $scope.item_price = parseFloat(order_checkout_object.display_total.split('$')[1])-parseFloat($scope.selected_shipping_rate.cost);
  $scope.shipping_cost = 0;
  $scope.total_cost = $scope.item_price;
  console.log($scope.shipments);
  $scope.change_shipping_rate = function(selected_shipping_rate){
    // $scope.shipping_cost = selected_shipping_rate.cost;
    // $scope.total_cost = parseFloat($scope.item_price)+parseFloat($scope.shipping_cost);
    // $scope.selected_shipping_rate_id = selected_shipping_rate.id;
    console.log(selected_shipping_rate);
    console.log($scope.selected_shipping_rate_id);
  };
  $scope.proceed_to_checkout_payment = function(){
    CustomerOrders.proceed_to_checkout_payment($rootScope.luxire_cart, $scope.shipment_id, $scope.selected_shipping_rate_id)
    .then(function(data){
      console.log(data);
      $rootScope.luxire_cart = data.data;
      $state.go('customer.checkout_payment');
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
