angular.module('luxire')
.controller('CustomerCheckoutAddressController',function($scope, $state, orders, $rootScope, ImageHandler, CustomerOrders, countries, $rootScope, $stateParams, CustomerAuthentication, $window){
  window.scrollTo(0, 0);
  console.log('CartController params', $stateParams);
  $scope.states = [];
  $scope.countries = [];
  /*Fetch countries*/
  $scope.load_countries = true;
  $scope.load_address = true;
  countries.all().then(function(data){
    $scope.load_countries = false;
    console.log('countries',data);
    $scope.countries = data.data;
  },function(error){
    $scope.load_countries = false;
    console.log('error',error);
  });

  /*Update state to address*/
  function update_state(order){
    if(order.state!="address"){
      CustomerOrders.update(order, {
        state: "address"
      })
      .then(function(data){
        console.log('updated cart state to ', data.data.state);
      }, function(error){
        console.log('update cart failed', error);
      });
    }
  };

  $scope.billing = {};
  $scope.shipping = {};
  function checkout_address_init(order){
    console.log('checkout address init', order);
    if(order.line_items.length){
      update_state(order);
      $scope.customer_email = order.email;
      $scope.billing = order.bill_address;
      $scope.shipping = order.ship_address;
    }
    else{
      $state.go('customer.cart');
    }
    $scope.load_address = false;
  }

  //$rootScope.luxire_cart to be replaced with params
  if($rootScope.luxire_cart && $rootScope.luxire_cart.hasOwnProperty('number') && $rootScope.luxire_cart.hasOwnProperty('token')){
    checkout_address_init($rootScope.luxire_cart);
  }
  else{
    console.log('rootScope cart', $rootScope.luxire_cart);
    $scope.$on('fetched_order_from_cookie', function(event, data){
      if(data.status == 404){
        $state.go('customer.home');
      }
      else if(data.status == 200){
        checkout_address_init(data.data);
      }
    });
  };

  $scope.populate_states = function(country){
    console.log('selected country', country);
  };


  $scope.go_to_delivery = function(event){
    event.preventDefault();
  };

  $scope.isLoggedIn = CustomerAuthentication.isLoggedIn();
  console.log($scope.isLoggedIn);

  $scope.same_address  = function(){
    console.log($scope.same);
    if($scope.same){
      $scope.billing = $scope.shipping;
    }
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  var address_formatter = function(address){
    var keys_to_remove = ['id', 'full_name', 'country', 'state', 'state_name', 'state_text'];
    angular.forEach(keys_to_remove, function(val, key){
      if(address[val]){
        if(val == 'country'){
          address.country_id = address[val].id;
        }
        else if(val == 'state'){
          address.state_id = address[val].id;
        }
        console.log('val', val);
        delete address[val];
      }
    });
    return address;
  }
  $scope.proceed_to_checkout_delivery = function(){
    $scope.customer_form.submitted = true;
    console.log('form before process', $scope.customer_form);
    if($scope.customer_form.$valid){
      $scope.customer_form.submitted = false;
      $scope.load_address = true;
      var shipping_address = {};
      var billing_address = {};
      if($scope.shipping){
        shipping_address = $scope.shipping;
        shipping_address = address_formatter(shipping_address);
        // shipping_address = address_formatter($scope.shipping);
      }
      if($scope.billing){
        billing_address = $scope.billing;
        billing_address = address_formatter(billing_address);
        // billing_address = address_formatter($scope.billing);
      }
      console.log('form after process', $scope.customer_form);

      order_address = {
        order: {
          email: $scope.customer_email,
          bill_address_attributes: billing_address,
          ship_address_attributes: shipping_address
        }
      };
      console.log(order_address);
      CustomerOrders.proceed_to_checkout_delivery($rootScope.luxire_cart, order_address)
      .then(function(data){
        console.log('move to delivery', data);
        $rootScope.luxire_cart = data.data;
        console.log('move to delivery with', $rootScope.luxire_cart);
        $state.go('customer.checkout_delivery');
      },function(error){
        alert('invalid data');
        $scope.load_address = false;
        console.log(error);
      });


    }


  };
  var coupon_status = ''
  $scope.apply_coupon_code = function(){
    CustomerOrders.apply_coupon_code($rootScope.luxire_cart, $scope.discountCode)
    .then(function(data){
      console.log(data);
      if(data.data.successful == true){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          $rootScope.alerts.push({type: 'success', message: 'Coupon code applied successfully'});
        }, function(error){
          $rootScope.alerts.push({type: 'danger', message: 'error fetching order after appying coupon code'});
          console.error(error);
        });
      }
      else{
        $rootScope.alerts.push({type: 'danger', message: data.data.error});

      }

    }, function(error){
      console.log(error);
      $rootScope.alerts.push({type: 'danger', message: error.data.error});
    });
  };

})
