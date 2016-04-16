angular.module('luxire')

.controller('editModalInstanceCtrl',function($scope, $uibModalInstance, luxireStock, createProductModalService){
  $scope.modalData = luxireStock;
  console.log("count from main controller : ",$scope.modalData.count);
  console.log("data from main controller : ",$scope.modalData.data);

    if($scope.modalData.count>1){

      $scope.luxireStock=$scope.modalData.data; // binding of inventory data to the inventory modal
			console.log("modaldata count >1:   ",$scope.luxireStock);

    }else{
			$scope.luxireStock=$scope.modalData.data; // binding of luxire stock data to the inventory modal
			console.log("modaldata count o:   ",$scope.luxireStock);

    }

    $scope.ok = function () { // ok button to pass values from inventory controller to main controller
      $uibModalInstance.close($scope.luxireStock);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
		$scope.addQuantity=function(quantity){  // function to add quantity in inventory modal
			console.log("add quantity is calling...");
			$scope.luxireStock.physical_count_on_hands=parseInt($scope.luxireStock.physical_count_on_hands)+parseInt(quantity);
      $scope.quantity='';
    }
		$scope.setQuantity=function(quantity){  // function to set quantity in inventory modal
			console.log("add quantity is calling...");
			$scope.luxireStock.physical_count_on_hands=parseInt(quantity);
      $scope.quantity='';

		}

});
