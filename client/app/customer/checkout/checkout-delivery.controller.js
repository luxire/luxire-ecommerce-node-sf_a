angular.module('luxire')
.controller('CustomerCheckoutDeliveryController',function($scope, $state, orders, $rootScope, $stateParams, ImageHandler, CustomerOrders, $window){
  window.scrollTo(0, 0);
  $scope.loading = true;
  function update_state(order){
    if(order.state!="delivery"){
      CustomerOrders.update(order, {
        state: "delivery"
      })
      .then(function(data){
        console.log('data', data);
        $state.go("customer.checkout_"+data.data.state.toLowerCase());
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
    $scope.loading = true;
    CustomerOrders.proceed_to_checkout_payment($rootScope.luxire_cart, $scope.shipment_id, $scope.selected_shipping_rate_id)
    .then(function(data){
      console.log(data);
      $scope.loading = false;
      $rootScope.luxire_cart = data.data;
      if(data.data.state === "complete"){
        $state.go('invoices', {number: data.data.number, token: data.data.token});
        $rootScope.alerts[0] = {type: 'success', message: 'Your order is successfully placed'};

      }
      else{
        $state.go('customer.checkout_payment');
        $scope.loading = false;
      }
    },function(error){
      $scope.loading = false;
      if(error.data && error.data.msg && error.data.msg.includes("out of stock")){
          $rootScope.alerts.push({type: 'danger', message: error.data.msg });
        }else{
          $rootScope.alerts.push({type: 'danger', message: 'Something went wrong. Please contact us.'});
        }
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
