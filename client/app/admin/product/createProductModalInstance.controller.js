angular.module('luxire')
.controller('createProductInventoryModalController',function($scope, luxireProperties, $uibModalInstance, luxireStock, createProductModalService ,products){
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
      $uibModalInstance.dismiss('cancel');
    };
});
