angular.module('luxire')
.controller('inventoryModalTestController',function($scope, $uibModal, $log){

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.open = function (size) {
    console.log("inventory modal fun is calling...");
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
      console.log("modal return value is : ",selectedItem);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

});


angular.module('luxire')
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  //$scope.selected = $scope.inventory;
  $scope.inventory={
      id : 100
  };

  $scope.ok = function () {
    $uibModalInstance.close($scope.inventory);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
