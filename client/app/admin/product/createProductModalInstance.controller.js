var luxire= angular.module('luxire');
luxire.controller('createProductInventoryModalController',function($scope,$uibModal,luxireProperties, $uibModalInstance, luxireStock, createProductModalService ,products){
  $scope.modalData = luxireStock;
	$scope.stock_location_id = 1;
  luxireProperties.luxirePropertiesIndex().then(function(data) {
  
    $scope.luxireProperties = data.data;
  }, function(info){
    console.log(info);
  })

  // end: inventory measuring unit
    if($scope.modalData.count>1){
      $scope.luxireStock=$scope.luxireStockValue;
		$scope.luxireStock["in_house"] = false;			
    }

    $scope.ok = function () {
      $uibModalInstance.close({luxireStock: $scope.luxireStock,sku: $scope.modalData.parent_sku_obj,stockLocationId: $scope.stock_location_id});
    };

    $scope.cancel = function () {
      $scope.openModal();
      $uibModalInstance.dismiss('cancel');
    };
    $scope.openModal = function(){
       var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        animation: true,
        templateUrl: 'confirmation.html',
        controller: 'editConfirmationModalInstanceCtrl',
        size: 'lg',
        resolve: {
        }
      });
    }
});
luxire.controller('editConfirmationModalInstanceCtrl',function($scope,$state,$uibModalInstance){
  $scope.ok = function(){
    $uibModalInstance.close();
    $state.go('admin.product');
  }
});
