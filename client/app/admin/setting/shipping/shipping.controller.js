angular.module('luxire')
.controller('ShippingController',['$scope', '$uibModal',function($scope, $uibModal){
  $scope.address = '';
  $scope.edit_address = function(){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'app/admin/setting/shipping/partials/ship_from_address.html',
      controller: 'AddressModalInstance',
      backdrop: 'static',
      windowClass: 'address_modal',
      size: 'lg',
      resolve: {
        current_address: function(){
          return $scope.address;
        }
      }
    });
  };
}])
.controller('AddressModalInstance',['$uibModalInstance',function($scope, $uibModalInstance, current_address){
  $scope.current_address = current_address;
}]);
