var luxire = angular.module('luxire');
luxire.controller('inventoryHomeController',function($scope, products, fileReader,$uibModal, prototypeObject, $state, luxireStocks, $timeout,$window){
  $scope.loading = true;
  $scope.alerts = [];//contains the alert messages
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  //*******  start inventory update part ***********
  $scope.inventoryObj = [];
  $scope.noInventoryMsg = false;
  //This is used to maintain the page count on scrolling
  $scope.pageCount = 1;
  //This function will ensure the next set of data is ready to bind to the inventoryObj
  $scope.load_more = function(){
    ++$scope.pageCount;
    luxireStocks.luxireStocksIndex($scope.pageCount).then(function(data){
      //console.log('the data.data',data.data); 
      $timeout(function () {
        var concatData = angular.copy($scope.inventoryObj);
        concatData = concatData.concat(data.data);
        $scope.inventoryObj = concatData;
      }, 0);
    })
  }
 
  luxireStocks.luxireStocksIndex().then(function(data) {  
      $scope.inventoryObj=data.data;
    if(data.data.length == 0){  // 18th march
      $scope.noInventoryMsg = true;
    }else{
      $scope.noInventoryMsg = false;
    }
    $scope.loading= false;
    flag = false;       
   
  }, function(err){
   console.log(err);
   $scope.loading= true;
 })

  $scope.updateQuantityValue=function(variant){
      variant.physical_count_on_hands=variant.physical_count_on_hands+variant.set_value;
      var luxire_stock={};
      luxire_stock["luxire_stock"]={};
      luxire_stock["luxire_stock"]["count"]=variant.set_value;
      luxire_stock["luxire_stock"]["parent_sku"]=variant.parent_sku;
      luxireStocks.luxireStocks_addQuantity(luxire_stock).then(function(data) {
        $scope.alerts.push({type: 'success', message: 'Update quantity successfull!'});
      }, function(err){
       console.log(err);
      })
      variant.set_value='';
  }
  $scope.setQuantityValue=function(variant){
      variant.physical_count_on_hands=variant.setInitial;
      var luxire_stock={};
      luxire_stock["luxire_stock"]={};
      luxire_stock["luxire_stock"]["count"]=variant.setInitial;
      luxire_stock["luxire_stock"]["parent_sku"]=variant.parent_sku;
      luxireStocks.luxireStocks_setQuantity(luxire_stock).then(function(data) {
        $scope.alerts.push({type: 'success', message: 'Update quantity successfull!!'});
      }, function(err){
       console.log(err);
      })
      variant.setInitial='';
  }

  $scope.showEditProducts=function(fabric){
    if(fabric.product.length>=1){
      $state.go("admin.inventoryProductEdit",{id: fabric.id});
    }else{
      $state.go("admin.inventoryProductEdit",{id: fabric.id});
    }
  }

  $scope.parentSkuStatus = false;
  $scope.parentSkuFalseCount = 0;
  $scope.openModal = function(){
    var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'createProductInventoryModal.html',
        controller: 'createInventoryModalController',
        size: 'lg',
        resolve: {
          luxireStock: function () {
            return {  sku_status:$scope.parentSkuStatus, falseCount: $scope.parentSkuFalseCount };
          }
        }
      });
      modalInstance.result.then(function (luxireStock) {
      $scope.luxireStock = luxireStock;
      console.log("modal return value is : ",$scope.luxireStock);
			$scope.parentSkuFalseCount++;
      products.createInventory(luxireStock).then(function(data){
        console.log(data);
        $scope.alerts.push({type: 'success',message: 'Inventory created Successfully'});
      },function(error){
        console.log(error);
      })
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  }

  //*******  end inventory update part ***********

});
luxire.controller('createInventoryModalController',function($scope, luxireProperties, $uibModalInstance, luxireStock, createProductModalService ,products){
$scope.stock_location_id = 1;
$scope.modalData = luxireStock;
  luxireProperties.luxirePropertiesIndex().then(function(data) {
          $scope.luxireProperties = data.data;
          console.log($scope.luxireProperties);
        }, function(info){
          console.log(info);
        })
      $scope.luxireStock=$scope.luxireStockValue;			
			if($scope.modalData.sku_status===true){
						$scope.luxireStock = $scope.modalData.parent_sku_obj;
			}else{
				if($scope.modalData.falseCount==0){
					$scope.luxireStock=$scope.modalData.parent_sku_obj;
				}else{
					$scope.luxireStock=$scope.modalData.data;
				}
			}
    $scope.ok = function () {
      $uibModalInstance.close({luxireStock: $scope.luxireStock,sku: $scope.luxireStock.parent_sku_obj,stockLocationId: $scope.stock_location_id});
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
})