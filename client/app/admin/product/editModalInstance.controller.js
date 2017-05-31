angular.module('luxire')

.controller('editModalInstanceCtrl',function($scope,products,luxireProperties, $uibModalInstance, luxireStock, createProductModalService){
  $scope.modalData = luxireStock;
  console.log('the modalData:',$scope.modalData);
  // start: inventory measuring unit
  luxireProperties.luxirePropertiesIndex().then(function(data) {
    $scope.luxireProperties = data.data;
    console.log($scope.luxireProperties);
  }, function(info){
    console.log(info);
  })
  $scope.updateStockId = $scope.modalData.product || $scope.modalData.id;
  // end: inventory measuring unit

 $scope.luxireStock=$scope.modalData.data; // binding of inventory data to the inventory modal

    $scope.ok = function () { // ok button to pass values from inventory controller to main controller
      // $scope.loading = true;
      products.updateStock($scope.updateStockId,$scope.luxireStock).then(function(data){
        // $scope.
        $scope.alerts.push({type:'success',message:'Inventory updated successfully!'});
      })
      $uibModalInstance.close($scope.luxireStock);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
		$scope.addQuantity=function(quantity){  // function to add quantity in inventory modal
			$scope.luxireStock.physical_count_on_hands=parseInt($scope.luxireStock.physical_count_on_hands)+parseInt(quantity);
      $scope.quantity='';
    }
		$scope.setQuantity=function(quantity){  // function to set quantity in inventory modal
			$scope.luxireStock.physical_count_on_hands=parseInt(quantity);
      $scope.quantity='';

		}

});
