  angular.module('luxire')
  .controller('CustomerCheckoutPaymentController',function($scope, $state, orders, $rootScope, $stateParams, ImageHandler, CustomerOrders){
    $scope.getImage = function(url){
      return ImageHandler.url(url);
    };
    CustomerOrders.create_payment($rootScope.luxire_cart).then(function(data){
      
      console.log(data);
    }, function(error){
      console.error(error);
    });


    $scope.name_on_card = 'Test';
    $scope.card_number = '4111111111111111';
    $scope.card_expiry = '07/16';
    $scope.card_cvv = '123';

    var ship_address = $rootScope.luxire_cart.ship_address;

    function genhash(secret_key,account_id,amount,reference_no,return_url,mode)
    {
      console.log(secret_key+' '+account_id+' '+amount+' '+reference_no+' '+return_url+' '+mode);
      var genStr = secret_key + "|" + account_id + "|" + amount + "|" + reference_no + "|" +return_url + "|" + mode
      console.log('genStr', genStr);
      var generatedhash = calcMD5(genStr)
      console.log('generatedhash', generatedhash);
      return generatedhash
    }
    var localhash = genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat($rootScope.luxire_cart.total), $rootScope.luxire_cart.number, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST');
    console.log(genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat($rootScope.luxire_cart.total), $rootScope.luxire_cart.number, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST' ));
    console.log('obtained hash', $rootScope.luxire_cart.secure_hash);
    var obtainedhash = $rootScope.luxire_cart.secure_hash;
    console.log('hash check', localhash === obtainedhash);
    // console.log('Hash value',genhash('c08d88e3fa40573b563af7887a7c9852','18449',parseFloat(500.00), 1001, 'https://test.luxire.com/api/checkouts/gateway_response', 'TEST' )

  $scope.ebs_object = {
    channel: '2',
    account_id: '18449',
    reference_no: $rootScope.luxire_cart.number,
    amount: parseFloat($rootScope.luxire_cart.total),
    mode: 'TEST',
    currency: 'INR',
    description: 'luxire',
    return_url: 'https://test.luxire.com/api/checkouts/gateway_response',
    name: ship_address.full_name || 'Mudassir',
    address: ship_address.address1 || '#74,kr colony',
    city: ship_address.city || 'Bangalore',
    state: ship_address.state.name || 'Karnataka',
    country: ship_address.country.iso3 || 'IND',
    postal_code: ship_address.zipcode || '560071',
    phone: ship_address.phone || '8951442694',
    email: $rootScope.luxire_cart.email || 'mudassir@azureiken.com',
    name_on_card: $scope.name_on_card,
    card_number: $scope.card_number,
    card_expiry: $scope.card_expiry,
    card_cvv: $scope.card_cvv,
    secure_hash: $rootScope.luxire_cart.secure_hash
  };


    $scope.proceed_to_checkout_ebs = function (){
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

    };


  })
