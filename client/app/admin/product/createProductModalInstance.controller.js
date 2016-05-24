angular.module('luxire')
.controller('createProductInventoryModalController',function($scope, luxireProperties, $uibModalInstance, luxireStock, createProductModalService ){
  $scope.modalData = luxireStock;
	$scope.addSetView = false;
  console.log("count from main controller : ",$scope.modalData.count);
  console.log("data from main controller : ",$scope.modalData.data);
	console.log("parent sku from main controller : ",$scope.modalData.parent_sku_obj);
	console.log("**** parent sku from main controller"+$scope.modalData.sku_status);
  // start: inventory measuring unit
  luxireProperties.luxirePropertiesIndex().then(function(data) {
    console.log('in inventory modal measuring units are...');
    //console.log(data);
    $scope.luxireProperties = data.data;
    //$scope.loading = false;
    console.log($scope.luxireProperties);
  }, function(info){
    console.log(info);
  })

  // end: inventory measuring unit

    if($scope.modalData.count>1){
      $scope.luxireStock=$scope.luxireStockValue;
			if($scope.modalData.sku_status===true){
				console.log("**********stock:",$scope.modalData.parent_sku_obj);
						$scope.luxireStock = $scope.modalData.parent_sku_obj;
						$scope.addSetView = true;
			}else{
				if($scope.modalData.falseCount==0){
					console.log("false count 0 part...");
					$scope.luxireStock=$scope.modalData.parent_sku_obj;
				}else{
					console.log("false count other  part...");
					$scope.luxireStock=$scope.modalData.data;
				}
				var parent_sku=$scope.modalData.parent_sku_obj.parent_sku;
				console.log("***** parent sku: ",parent_sku);
				//$scope.luxireStock=$scope.modalData.data;
				$scope.luxireStock["stock_location_id"]=1;
				$scope.luxireStock["parent_sku"]=parent_sku;
				console.log("in false: inventory obj is: ",$scope.luxireStock);

			}

    }else{
			if($scope.modalData.sku_status===true){
						$scope.addSetView = true;
						console.log("**********stock:",$scope.modalData.parent_sku_obj);
						$scope.luxireStock = $scope.modalData.parent_sku_obj;
			}else{
				var parent_sku=$scope.modalData.parent_sku_obj.parent_sku;
				console.log("***** parent sku: ",parent_sku);
				$scope.luxireStock=$scope.modalData.data;
				$scope.luxireStock["stock_location_id"]=1;
				$scope.luxireStock["parent_sku"]=parent_sku;
				console.log("in false: inventory obj is: ",$scope.luxireStock);

			}

    }

    $scope.ok = function () {
      $uibModalInstance.close($scope.luxireStock);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
		$scope.addQuantity=function(quantity){
			console.log("add quantity is calling...");
			$scope.luxireStock.physical_count_on_hands=parseInt($scope.luxireStock.physical_count_on_hands)+parseInt(quantity);
		}
		$scope.setQuantity=function(quantity){
			console.log("add quantity is calling...");
			$scope.luxireStock.physical_count_on_hands=parseInt(quantity);
		}

});
