angular.module('luxire')
.controller('CustomerCheckoutAddressController',function($scope, $state, orders, $rootScope, ImageHandler, CustomerOrders, countries, $rootScope, $stateParams, CustomerAuthentication, $window){
  window.scrollTo(0, 0);
  console.log('CartController params', $stateParams);
  $scope.states = [];
  $scope.countries = [];
  /*Fetch countries*/
  $scope.load_countries = true;
  $scope.load_address = true;
  $scope.billing = {};
  $scope.shipping = {};
  countries.all().then(function(data){
    $scope.load_countries = false;
    $scope.countries = JSON.parse(data.data.countries);
    requested_country = JSON.parse(data.data.requested_country);
    console.log('req country', requested_country);
    console.log('order', $rootScope.luxire_cart);
    if($rootScope.luxire_cart && $rootScope.luxire_cart.hasOwnProperty('number') && !$rootScope.luxire_cart.ship_address){
      console.log('address not there');
      if(!$scope.shipping){
        $scope.shipping = {};
      }
      if(!$scope.billing){
        $scope.billing = {};
      }
      for(var i=0;i<$scope.countries.length;i++){
        if($scope.countries[i].iso == requested_country.country_code){
          console.log('shipping', $scope.shipping);
          $scope.shipping.country = $scope.countries[i];
          $scope.billing.country = $scope.countries[i];
          for(var j=0;j<$scope.shipping.country.states.length;j++){
            if($scope.shipping.country.states[j].abbr == requested_country.region_code){
              $scope.shipping.state = $scope.shipping.country.states[j];
              $scope.billing.state = $scope.shipping.country.states[j];
              j = $scope.shipping.country.states.length;
              i = $scope.countries.length;
            }
          }
        }
      }
    }
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
      console.log('fetched order', data.data);
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

  var process_errors = function(error){
    console.log('processing error', error);
    angular.forEach(error.errors, function(val,key){
      if(key === 'base'){
        $rootScope.alerts[0] = {type: 'danger', message: error.errors.base[0]};
      }
      else{
        $rootScope.alerts[0] = {type: 'danger', message: key.split('.')[0]+' '+key.split('.')[1]+' '+val[0]};
      }
    });
    if(error.errors && error.errors.base){
    }
  };


  var address_formatter = function(address){
    var formatted_address = {};
    console.log('before formatting address', address);
    var keys_to_retain = ['firstname', 'lastname', 'company', 'address1', 'address2', 'city', 'zipcode','phone'];
    angular.forEach(keys_to_retain, function(val, key){
      if(address[val]){
        formatted_address[val] =  address[val];
      }
    });
    formatted_address['country_id'] = address.country.id;
    formatted_address['state_id'] = address.state.id;
    console.log('after formatting address', formatted_address);
    return formatted_address;
  }
  var err_field = '';
  $scope.proceed_to_checkout_delivery = function(){
    $scope.customer_form.submitted = true;
    console.log('form before process', $scope.customer_form);
    if($scope.customer_form.$valid){
      $scope.customer_form.submitted = false;
      $scope.load_address = true;
      var shipping_address = {};
      var billing_address = {};
      console.log('shipping address', $scope.shipping);
      console.log('billing address', $scope.billing);

      shipping_address = address_formatter($scope.shipping);
      billing_address = address_formatter($scope.billing);

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
        console.log(error);
        process_errors(error.data);
        $scope.load_address = false;
      });
    }
    else{
      if($scope.customer_form.$error && $scope.customer_form.$error.required){
        for(var i=0;i<$scope.customer_form.$error.required.length;i++){
          err_field = '';
          if($scope.customer_form.$error.required[i].$name.indexOf('ship')===-1&&$scope.customer_form.$error.required[i].$name.indexOf('bill')===-1){
            err_field = $scope.customer_form.$error.required[i].$name;
            $rootScope.alerts[0] = {type: 'danger', message: 'Please fill in the mandatory field: Customer '+err_field};
          }
          else if($scope.customer_form.$error.required[i].$name.indexOf('ship')!==-1){
            err_field = $scope.customer_form.$error.required[i].$name.split('ship_');
            $rootScope.alerts[0] = {type: 'danger', message: 'Please fill in the mandatory field: Shipping address '+err_field[1]};
          }
          else if($scope.customer_form.$error.required[i].$name.indexOf('bill')!==-1 && !$scope.same){
            err_field = $scope.customer_form.$error.required[i].$name.split('bill_');
            $rootScope.alerts[0] = {type: 'danger', message: 'Please fill in the mandatory field: Billing address '+err_field[1]};
          }
          break;
        }
      }
      else if(Object.keys($scope.customer_form.$error).length>0){
        err_field = $scope.customer_form.$error[Object.keys($scope.customer_form.$error)[0]];
        $rootScope.alerts[0] = {type: 'danger', message: 'Please enter valid : Customer '+Object.keys($scope.customer_form.$error)[0]};
      }
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
