angular.module('luxire')
.controller('CustomerCheckoutDeliveryController',function($scope, $rootScope, $state, orders, $rootScope, $stateParams, ImageHandler, CustomerOrders, $window){
  window.scrollTo(0, 0);
  $scope.loading = true;
  function update_state(order){
    if(order.state!="delivery"){
      CustomerOrders.update(order, {
        state: "delivery"
      })
      .then(function(data){
        console.log('updated cart state to ', data.data.state);
      }, function(error){
        console.log('update cart failed', error);
      });
    }
  };
  function checkout_delivery_init(order){
    if(order.shipments.length){
      update_state(order);
      console.log('luxire_cart', order);
      $scope.loading = false;
      $scope.shipping_address = order.ship_address;
      $scope.shipments = order.shipments[0];
      $scope.shipment_id = order.shipments[0].id;
      $scope.selected_shipping_rate = $scope.shipments.selected_shipping_rate;
      $scope.selected_shipping_rate_id = $scope.shipments.selected_shipping_rate.id;
    }
    else{
      $state.go('customer.checkout_address');
    }

  }
  if($rootScope.luxire_cart && $rootScope.luxire_cart.hasOwnProperty('number') && $rootScope.luxire_cart.hasOwnProperty('token')){
    checkout_delivery_init($rootScope.luxire_cart);
  }
  else{
    $scope.$on('fetched_order_from_cookie', function(event, data){
      if(data.status == 404){
        $state.go('customer.home');
      }
      else if(data.status == 200){
        checkout_delivery_init(data.data);
      }
      $scope.loading = false;

    });
  };



  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.change_shipping_rate = function(selected_shipping_rate){
    console.log(selected_shipping_rate);
    console.log($scope.selected_shipping_rate_id);
  };
  $scope.proceed_to_checkout_payment = function(){
    CustomerOrders.proceed_to_checkout_payment($rootScope.luxire_cart, $scope.shipment_id, $scope.selected_shipping_rate_id)
    .then(function(data){
      console.log(data);
      $rootScope.luxire_cart = data.data;
      if(data.data.state === "complete"){
        $state.go('invoices', {number: data.data.number, token: data.data.token});
        $rootScope.alerts[0] = {type: 'success', message: 'Your order is successfully placed'};

      }
      else{
        $state.go('customer.checkout_payment');
      }
    },function(error){
      console.error(error);
    });
  };

});
function genhash(secret_key,account_id,amount,reference_no,return_url,mode)
{
  var genStr = secret_key + "|" + account_id + "|" + amount + "|" + reference_no + "|" +return_url + "|" + mode
  var generatedhash = calcMD5(genStr)
  return generatedhash
}
