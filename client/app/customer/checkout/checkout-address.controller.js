angular.module('luxire')
.controller('CustomerCheckoutAddressController',function($scope, $state, orders, $rootScope, ImageHandler, countries, $rootScope, $stateParams){
  $scope.billing = {};
  $scope.shipping = {};
  $scope.states = [];
  $scope.countries = [];
  countries.all().then(function(data){
    console.log('countries',data);
    $scope.countries = data.data;
    $scope.states = $scope.shipping.country_id == null ? [] : $scope.countries[$scope.shipping.country_id-1].states
  },function(error){
    console.log('error',error);
  });

  $scope.same_address  = function(){
    console.log($scope.same);
    if($scope.same){
      $scope.billing = $scope.shipping;
    }
  };


  $scope.populate_states = function(country_id){
    console.log(country_id);
    $scope.states = $scope.countries[country_id -1].states;
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
      order_number = $rootScope.luxire_cart.number;
      order_token = $rootScope.luxire_cart.token;
      orders.proceed_to_checkout_delivery(order_number, order_token, order_address)
      .then(function(data){
        $rootScope.luxire_cart = data.data;
        console.log(data);
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
    orders.apply_coupon_code($rootScope.luxire_cart.number, $rootScope.luxire_cart.token, $scope.coupon_code).then(
      function(data){
        console.log(data);
        coupon_status = data.data;
        if(data.data.successful == true){
          orders.get_order_by_id($stateParams.checkoutObject.number,$stateParams.checkoutObject.token).then(function(data){
            $rootScope.luxire_cart = data.data.body;
            // $scope.line_items = data.data.line_items;
            // $scope.display_item_total = data.data.display_item_total;
            // $scope.display_total = data.data.display_total;
            // $scope.adjustment_total = '-$'+data.data.adjustment_total.split('-')[1];
            // $scope.shipping_total = data.data.display_ship_total;
            alert(coupon_status.success);
            console.log(data);
          },function(error){
            console.error(data);}
          );
        }
        else{
          alert(data.data.success);
        };
      },function(error){
        alert(error.data.error);
        console.error(error);
      }
    );
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
