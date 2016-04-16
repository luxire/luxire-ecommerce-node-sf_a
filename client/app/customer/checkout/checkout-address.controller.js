angular.module('luxire')
.controller('CustomerCheckoutAddressController',function($scope, $state, orders, $rootScope, ImageHandler, CustomerOrders, countries, $rootScope, $stateParams, CustomerAuthentication, $window){
  window.scrollTo(0, 0);
  countries.all().then(function(data){
    console.log('countries',data);
    $scope.countries = data.data;
  },function(error){
    console.log('error',error);
  });
  $scope.customer_email = $rootScope.luxire_cart.email;
  $scope.states = [];
  $scope.countries = [];
  $scope.billing = {};
  $scope.shipping = {};
  var address_prototype = {
    firstname: '',
    lastname: '',
    address1: '',
    city: '',
    phone: '',
    zipcode: '',
    state_id: 0,
    country_id: 0
  };

  $scope.populate_states = function(country_id, addr_type){
    console.log(country_id);
    if(addr_type == 'ship'){
      $scope.shipping_states = $scope.countries[country_id -1].states;
      $scope.shipping.country_id = country_id;
    }
    else if(addr_type == 'bill'){
      $scope.billing_states = $scope.countries[country_id -1].states;
      $scope.billing.country_id = country_id;
    }
  };

  if($rootScope.luxire_cart.bill_address && $rootScope.luxire_cart.bill_address!={}){
    angular.forEach(address_prototype, function(val, key){
      $scope.billing[key] = $rootScope.luxire_cart.bill_address[key];
    });
    $scope.selected_billing_country = $rootScope.luxire_cart.bill_address.country;
    console.log('bill country', $scope.selected_billing_country);
    // $scope.populate_states($scope.selected_billing_country.id, 'bill');
    $scope.selected_billing_state = $rootScope.luxire_cart.bill_address.state;
  };

  if($rootScope.luxire_cart.ship_address && $rootScope.luxire_cart.ship_address!={}){
    angular.forEach(address_prototype, function(val, key){
      $scope.shipping[key] = $rootScope.luxire_cart.ship_address[key];
    });
    $scope.selected_shipping_country = $rootScope.luxire_cart.ship_address.country;
    // $scope.populate_states($scope.selected_shipping_country.id, 'ship');
    $scope.selected_shipping_state = $rootScope.luxire_cart.ship_address.state;
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




  $scope.select_state = function(state_id, addr_type){
    console.log(state_id);
    if(addr_type == 'ship'){
      $scope.shipping.state_id = state_id;
    }
    else if(addr_type == 'bill'){
      $scope.billing.state_id = state_id;
    }
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.proceed_to_checkout_delivery = function(){
    console.log($scope.shipping);
    console.log($scope.billing);
    if($scope.customer_email != null && $scope.customer_email != undefined){
      order_address = {
        order: {
          email: $scope.customer_email,
          bill_address_attributes: $scope.billing,
          ship_address_attributes: $scope.shipping
        }
      };
      console.log(order_address);
      CustomerOrders.proceed_to_checkout_delivery($rootScope.luxire_cart, order_address)
      .then(function(data){
        console.log(data);
        $rootScope.luxire_cart = data.data;
        $state.go('customer.checkout_delivery');
      },function(error){
        console.log(error);
      });
    }
    else{
      alert('Please enter customer email address');
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

  // alert('hello');
  // console.log($stateParams.checkoutObject);
  // $scope.line_items = $stateParams.checkoutObject.line_items;
  // $scope.display_item_total = $stateParams.checkoutObject.display_item_total;
  // $scope.display_total = $stateParams.checkoutObject.display_total;
  // $scope.adjustment_total = '$'+$stateParams.checkoutObject.adjustment_total;
  // $scope.shipping_total = $stateParams.checkoutObject.display_ship_total;
  //
  // var shipping_address = $stateParams.checkoutObject.ship_address;
  // $scope.shipping = {
  //   firstname: '',
  //   lastname: '',
  //   address1: '',
  //   city: '',
  //   phone: '',
  //   zipcode: '',
  //   state_id: 0,
  //   country_id: 0
  // };
  // if(shipping_address != null){
  //   angular.forEach($scope.shipping, function(value, key){
  //       $scope.shipping[key] = shipping_address[key]
  //    });
  // }
  // else{
  //   $scope.shipping = {
  //     firstname: 'Mudassir',
  //     lastname: 'H',
  //     address1: '#74, 1st cross',
  //     email: 'm@azk.com',
  //     city: 'Boston',
  //     phone: '8951442694',
  //     zipcode: '02108',
  //     state_id: 3545,
  //     country_id: 232
  //   };
  // };
  //
  //

  //
  // $scope.order_total = '$'+$stateParams.checkoutObject.total;
  //

  // $scope.proceed_to_checkout_delivery = function(){
  //   if($scope.customer_email != null && $scope.customer_email != undefined){
  //     order_address = {
  //       order: {
  //         email: $scope.customer_email,
  //         bill_address_attributes: $scope.shipping,
  //         ship_address_attributes: $scope.shipping
  //       }
  //     };
  //     console.log(order_address);
  //     order_number = $stateParams.checkoutObject.number;
  //     order_token = $stateParams.checkoutObject.token;
  //     orders.proceed_to_checkout_delivery(order_number, order_token, order_address)
  //     .then(function(data){
  //       console.log(data);
  //       $state.go('checkout_delivery',{checkoutObject: data.data});
  //     },function(error){
  //       console.log(error);
  //     });
  //   }
  //   else{
  //     alert('Please enter customer email address');
  //   }
  //
  // };
  // var coupon_status = ''
  // $scope.apply_coupon_code = function(){
  //   orders.apply_coupon_code($stateParams.checkoutObject.number, $stateParams.checkoutObject.token, $scope.coupon_code).then(
  //     function(data){
  //       console.log(data);
  //       coupon_status = data.data;
  //       if(data.data.successful == true){
  //         orders.get_order_by_id($stateParams.checkoutObject.number,$stateParams.checkoutObject.token).then(function(data){
  //           $scope.line_items = data.data.line_items;
  //           $scope.display_item_total = data.data.display_item_total;
  //           $scope.display_total = data.data.display_total;
  //           $scope.adjustment_total = '-$'+data.data.adjustment_total.split('-')[1];
  //           $scope.shipping_total = data.data.display_ship_total;
  //           alert(coupon_status.success);
  //           console.log(data);
  //         },function(error){
  //           console.error(data);}
  //         );
  //       }
  //       else{
  //         alert(data.data.success);
  //       };
  //     },function(error){
  //       alert(error.data.error);
  //       console.error(error);
  //     }
  //   );
  // };
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
