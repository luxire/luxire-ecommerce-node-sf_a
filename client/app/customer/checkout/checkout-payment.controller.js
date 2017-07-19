angular.module('luxire')
.controller('CustomerCheckoutPaymentController',function($scope, $state, $window, orders, $rootScope, $stateParams, ImageHandler, CustomerOrders, $timeout){
  window.scrollTo(0, 0);
  console.log('luxire_cart after payment', $rootScope.luxire_cart);
  $scope.loading = true;

  var brain_tree_payment_received = function(details){
    console.log('payment received details', details);
    $scope.proceed_to_brain_tree_payment(details.nonce);
  };
  var brain_tree_ready = function(ready){
    console.log('brain tree payment ready', ready);
    $scope.loading = false;
    $("#braintree-paypal-button")[0].click();
  };

  var brain_tree_error = function(error){
    console.log('error', error);
  };

  $scope.brain_tree_payment_method_id = -1;
  $scope.brain_tree_client_token = "";
  var set_brain_tree_payment_method_id = function(order){
    if(order && order.payment_methods && order.payment_methods.length){
      for(var i=0;i<order.payment_methods.length;i++){
        if(order.payment_methods[i].method_type=== "braintree_vzero_hosted_fields"){
          $scope.brain_tree_payment_method_id = order.payment_methods[i].id;
        };
      };
    }
  };




  function brain_tree_init(order, payment_method_id){
    console.log('cart', order);
    $scope.loading = true;

    CustomerOrders.brain_tree_init(payment_method_id, order)
    .then(function(data){
      $timeout(function(){
        braintree.client.create({
        authorization: data.data.token
        }, function (err, clientInstance) {
          if (err) {
            console.error(err);
            $scope.loading = false;
            $rootScope.alerts.push({type: 'danger', message: err});
            return;
          }
          braintree.hostedFields.create({
            client: clientInstance,
            styles: {
              'input': {
                'font-size': '14px',
                'font-family': 'helvetica, tahoma, calibri, sans-serif',
                'color': '#3a3a3a'
              },
              ':focus': {
                'color': 'black'
              }
            },
            fields: {
              number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123'
              },
              expirationMonth: {
                selector: '#expiration-month',
                placeholder: 'MM'
              },
              expirationYear: {
                selector: '#expiration-year',
                placeholder: 'YY'
              }
              // ,
              // postalCode: {
              //   selector: '#postal-code',
              //   placeholder: '08820'
              // }
            }
          }, function (err, hostedFieldsInstance) {
            if (err) {
              console.error(err);
              $scope.loading = false;
              $rootScope.alerts.push({type: 'danger', message: err});
              return;
            }

            console.log('hostedFieldsInstance', hostedFieldsInstance);

            $timeout(function(){
              $scope.loading = false;
            },0)
            $scope.brain_tree_client_token = data.data.token;
            $scope.brain_tree_hosted_field_instance = hostedFieldsInstance;


          });
        });
        console.log(data);
      })

    }, function(error){
      $scope.loading = false;
      console.error(error);
    });

  }

  $scope.change_payment_method = function(payment_id){
    $scope.selected_payment_method_id = payment_id;
    if(($scope.brain_tree_payment_method_id == payment_id) && !$scope.brain_tree_client_token){
      brain_tree_init($rootScope.luxire_cart, $scope.brain_tree_payment_method_id)
    }

  };



  function update_state(order){
    if(order.state!="payment"){
      CustomerOrders.update(order, {
        state: "payment"
      })
      .then(function(data){
        console.log('updated cart state to ', data.data.state);
      }, function(error){
        console.log('update cart failed', error);
      });
    }
  };
  function checkout_payment_init(order){
    if(order.payment_methods.length){
      update_state(order);
    }
    else{
      $state.go('customer.checkout_delivery');
    }
  }
  if($rootScope.luxire_cart && $rootScope.luxire_cart.hasOwnProperty('number') && $rootScope.luxire_cart.hasOwnProperty('token')){
    if($rootScope.luxire_cart && $rootScope.luxire_cart.number){
      update_state($rootScope.luxire_cart);
      set_brain_tree_payment_method_id($rootScope.luxire_cart);
      console.log('cart exists');
      $scope.loading = false;

      // brain_tree_init($rootScope.luxire_cart);
    }
  }
  else{
    console.log('CartController params', $stateParams);
    $scope.$on('fetched_order_from_cookie', function(event, data){
      console.log('successful fetch',data);
      if(data.status == 200){
        var order = data.data;
        if(order && order.number){
          update_state(order);
          set_brain_tree_payment_method_id(order);
          console.log('cart doesnt exists');
          $scope.loading = false;

          // brain_tree_init(order);
        }
      }
      else{
        $scope.loading = false;
        $state.go('customer.home');
      }
    });
  };

  /*Brain tree initialisation*/

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.selected_payment_method_id = -1;
  $scope.gift_card_code = '';
  $scope.apply_gift_card = function(){
    if($scope.gift_card_code){
      $scope.loading = true;

      CustomerOrders.apply_gift_card($rootScope.luxire_cart, $scope.gift_card_code).then(function(data){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          $scope.loading = false;
          $scope.gift_card_code = '';
          $rootScope.alerts.push({type: 'success', message: 'GIft card applied Successfuly!'});
        }, function(error){
          $scope.loading = false;
          $rootScope.alerts.push({type: 'danger', message: 'error fetching order after appying coupon code'});
          console.error(error);
        });
      },
      function(error){
        $scope.loading = false;
        if(error.data && error.data.reason){
            $rootScope.alerts.push({type: 'danger', message: error.data.reason});
          }else{
            $rootScope.alerts.push({type: 'danger', message: 'error applying gift card'});
          }
      });
    }
    else{
      $rootScope.alerts.push({type: 'danger', message: 'Please enter gift card code'});
    }
  };




  $scope.proceed_to_brain_tree_payment = function(nonce){
    $scope.loading = true;
    var nonce = nonce ? nonce : $("input[name=payment_method_nonce]").val();
    console.log('nonce', nonce);
    var brain_tree_object = {
      order:{
        payments_attributes:[
          {
            payment_method_id: $scope.selected_payment_method_id,
            braintree_nonce: nonce
          }
        ],
        coupon_code: ""
      },
      // paypal_email: "bt_buyer_us@paypal.com",
      state: "payment"
    }
    CustomerOrders.checkout_paypal_brain_tree($rootScope.luxire_cart, brain_tree_object)
    .then(function(data){
      $scope.loading = false;
      $state.go('invoices', {number: data.data.number, token: data.data.token})
      // $("input[name=payment_method_nonce]").val() = "";
      console.log(data);
    }, function(error){
      $scope.loading = false;
      console.error(error);
      if(error.data.errors && error.data.errors.base && error.data.errors.base.length){
        $rootScope.alerts.push({type: 'danger', message: error.data.errors.base[0]});
      }
      else{
        $rootScope.alerts.push({type: 'danger', message: error.data.error});
      }


    });

  };

  $scope.proceed_to_paypal_payment = function(){
    if(parseFloat($rootScope.luxire_cart.total)==0.0){
      $scope.loading = true;

      CustomerOrders.auto_complete($rootScope.luxire_cart)
      .then(function(data){
        $scope.loading = false;
        $rootScope.alerts[0] = {type: 'success', message: 'Your order is successfully placed'};
        $state.go('invoices', {number: data.data.number, token: data.data.token});
        console.log('data', data);
      }, function(error){
        $scope.loading = false;
        if(error.data && error.data.msg.includes("out of stock")){
          $rootScope.alerts.push({type: 'danger', message: error.data.msg });
        }else{
          $rootScope.alerts.push({type: 'danger', message: 'Something went wrong. Please contact us.'});
        }
        console.log('data', error);
      });
    }
    else{
      if($scope.selected_payment_method_id != -1){
        $scope.loading = true;
        var selected_payment_method_type = "";
        for(var i=0;i<$rootScope.luxire_cart.payment_methods.length;i++){
          if($rootScope.luxire_cart.payment_methods[i].id == $scope.selected_payment_method_id){
            selected_payment_method_type = $rootScope.luxire_cart.payment_methods[i].method_type;
          };
        };
        console.log('selected payment method', selected_payment_method_type);
        if(selected_payment_method_type === "paypal"){
          CustomerOrders.checkout_payment_pay_pal($scope.selected_payment_method_id, $rootScope.luxire_cart)
          .then(function(data){
            $scope.loading = false;
            console.log(data);
            $window.location.href = data.data;
          }, function(error){
            $scope.loading = false;
            $state.go('customer.payment_failed');
            console.error(error);
            $rootScope.alerts.push({type: 'danger', message: error.data.msg});

          });
        }
        else if(selected_payment_method_type.toLowerCase().indexOf('braintree_vzero') != -1 && $scope.brain_tree_client_token){
          $scope.brain_tree_hosted_field_instance.tokenize(function (err, payload) {
            $timeout(function(){
              if (err) {
                console.error(err);
                $scope.loading = false;
                $rootScope.alerts.push({type: 'danger', message: err.message});
                return;
              }
              console.log('payload', payload);
              $scope.proceed_to_brain_tree_payment(payload.nonce);

            },0)


          });
          // brain_tree_init($rootScope.luxire_cart, $scope.selected_payment_method_id);
          // $("#braintree-paypal-button")[0].click();

        }
        // else if(selected_payment_method_type === "braintree_vzero_paypal_express"){
        //
        //   $("#braintree-paypal-button")[0].click();
        //
        // }


      }
      else{
        $rootScope.alerts.push({type: 'danger', message: 'Please select a payment method'});
      }
    }

  };


})

  // CustomerOrders.create_payment($rootScope.luxire_cart).then(function(data){
  //
  //   console.log(data);
  // }, function(error){
  //   console.error(error);
  // });


//   $scope.name_on_card = 'Test';
//   $scope.card_number = '4111111111111111';
//   $scope.card_expiry = '07/16';
//   $scope.card_cvv = '123';
//
//   var ship_address = $rootScope.luxire_cart.ship_address;
//
//   function genhash(secret_key,account_id,amount,reference_no,return_url,mode)
//   {
//     console.log(secret_key+' '+account_id+' '+amount+' '+reference_no+' '+return_url+' '+mode);
//     var genStr = secret_key + "|" + account_id + "|" + amount + "|" + reference_no + "|" +return_url + "|" + mode
//     console.log('genStr', genStr);
//     var generatedhash = calcMD5(genStr)
//     console.log('generatedhash', generatedhash);
//     return generatedhash
//   }
//   var localhash = genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat($rootScope.luxire_cart.total), $rootScope.luxire_cart.number, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST');
//   console.log(genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat($rootScope.luxire_cart.total), $rootScope.luxire_cart.number, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST' ));
//   console.log('obtained hash', $rootScope.luxire_cart.secure_hash);
//   var obtainedhash = $rootScope.luxire_cart.secure_hash;
//   console.log('hash check', localhash === obtainedhash);
//   // console.log('Hash value',genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat(500.00), 1001, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST' )
//
// $scope.ebs_object = {
//   channel: '2',
//   account_id: '18449',
//   reference_no: $rootScope.luxire_cart.number,
//   amount: parseFloat($rootScope.luxire_cart.total),
//   mode: 'TEST',
//   currency: 'INR',
//   description: 'luxire',
//   return_url: 'https://test.luxire.com/api/checkouts/gateway_response',
//   name: ship_address.full_name || 'Mudassir',
//   address: ship_address.address1 || '#74,kr colony',
//   city: ship_address.city || 'Bangalore',
//   state: ship_address.state.name || 'Karnataka',
//   country: ship_address.country.iso3 || 'IND',
//   postal_code: ship_address.zipcode || '560071',
//   phone: ship_address.phone || '8951442694',
//   email: $rootScope.luxire_cart.email || 'mudassir@azureiken.com',
//   name_on_card: $scope.name_on_card,
//   card_number: $scope.card_number,
//   card_expiry: $scope.card_expiry,
//   card_cvv: $scope.card_cvv,
//   secure_hash: $rootScope.luxire_cart.secure_hash
// };

    // $scope.proceed_to_checkout_ebs = function (){
      // var new_ebs_object = {
      //   channel: '2',
      //   account_id: '18449',
      //   reference_no: $rootScope.luxire_cart.number,
      //   amount: parseFloat($rootScope.luxire_cart.total),
      //   mode: 'TEST',
      //   currency: 'INR',
      //   description: 'luxire',
      //   return_url: 'https://test.luxire.com/api/checkouts/gateway_response',
      //   name: ship_address.full_name || 'Mudassir',
      //   address: ship_address.address1 || '#74,kr colony',
      //   city: ship_address.city || 'Bangalore',
      //   state: ship_address.state.name || 'Karnataka',
      //   country: ship_address.country.iso3 || 'IND',
      //   postal_code: ship_address.zipcode || '560071',
      //   phone: ship_address.phone || '8951442694',
      //   email: $rootScope.luxire_cart.email || 'mudassir@azureiken.com',
      //   name_on_card: $scope.name_on_card,
      //   card_number: $scope.card_number,
      //   card_expiry: $scope.card_expiry,
      //   card_cvv: $scope.card_cvv,
      //   secure_hash: genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat($rootScope.luxire_cart.total), $rootScope.luxire_cart.number, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST' )
      // };
      // orders.request_ebs(new_ebs_object).then(function(data){
      //   console.log(data);
      //   // orders.checkout_confirm_payment($rootScope.luxire_cart.number, $rootScope.luxire_cart.token).then(function(data){
      //   //   console.log(data);
      //   // },function(error){
      //   //   console.error(error);
      //   // });
      //   $state.go('checkout_gateway',{gatewayObject: data.data});
      // },function(error){
      //   console.error(error);
      // });

    // };
