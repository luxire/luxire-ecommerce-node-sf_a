angular.module('luxire')
.controller('ShippingController',function($scope, $uibModal, shipping_service){
  $scope.address = {};
  shipping_service.get_stock_location().then(function(data){
    $scope.address = data.data;
    shipping_service.countries().then(function(data){
      $scope.countries = data.data;
    },function(error){
      console.error(error);
    });
  }, function(error){
    console.log(error);
  });
  $scope.edit_address = function(){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/admin/setting/shipping/partials/ship_from_address.html',
      controller: 'AddressModalInstance',
      backdrop: 'static',
      windowClass: 'address_modal',
      size: 'md',
      resolve: {
        current_address: function(){
          return $scope.address;
        },
        countries: function(){
          return $scope.countries;
        }
      }
    });

    modalInstance.result.then(function(modified_address){
      shipping_service.update_stock_location(modified_address).then(function(data){
        console.log(data);
        $scope.address = data.data;
      },function(error){
        console.error(error);
      });
      console.log('modified_address', modified_address);
    },function(){
      console.log('Modal dismissed at: '+ new Date());
    });
  };
})
.controller('AddressModalInstance',function($scope, $uibModalInstance, current_address, countries, shipping_service){
  console.log(current_address);
  $scope.countries = countries;
  $scope.populate_states = function(country_id){
    $scope.states = $scope.countries[country_id -1].states;
    console.log($scope.states);
  };

  $scope.country_select = function(country){
    console.log(country);
  };

  $scope.address = current_address;
  console.log(countries);
  $scope.states = current_address.country_id != (null || undefined) ? $scope.populate_states(current_address.country_id) : [];
  $scope.submit_attempt = false;

  // shipping_service.countries().then(function(data){
  //   console.log(data);
  //   $scope.countries = data.data;
  // },function(error){
  //   console.error(error);
  // });



  /*dismiss model on clicking cancel*/
  $scope.cancel = function(){
    console.log($scope.address);
    $uibModalInstance.dismiss('cancel');
  };
  /*dismiss model on clicking close*/
  $scope.close_modal = function(){
    $scope.cancel();
  };
  $scope.update_address = function(){
    $scope.submit_attempt = true;
    if($scope.address_form.$valid){
      console.log($scope.address);
        $uibModalInstance.close($scope.address);
    }
  };

});
