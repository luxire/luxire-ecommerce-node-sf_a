angular.module('luxire')
.controller('inventoryNewProductController',function($scope, $state, $stateParams, products, createProductModalService, $uibModal, $log){
    $scope.parentSku = $stateParams.sku;//contains the parent sku 
    $scope.modalCount=0;
  	$scope.animationsEnabled = true;
  	$scope.dummyInventoryData='';


    $scope.luxireStock='';
  	$scope.parentSkuStatus='';
  	$scope.parentSkuFalseCount=0;
  	var productTypeId='';
  	var parentSkuObj='';
  	products.allProductType().then(function(data) {
  		$scope.allproductType=data.data;
  	}, function(info){
  		console.log(info);
  	})

  	$scope.showProductType=function(){
  		 productTypeId=$scope.newProductType.type;
  	}

    var parentSkuObj={
      parent_sku: $scope.parentSku,
    }
    $scope.openModal = function (size) {
      $scope.modalCount++;
      if($scope.modalCount>1){
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'createProductInventoryModal.html',
          controller: 'createProductInventoryModalController',
          size: size,
          resolve: {
            luxireStock: function () {
              return { count:$scope.modalCount,data:$scope.dummyInventoryData, parent_sku_obj: parentSkuObj, sku_status:$scope.parentSkuStatus, falseCount: $scope.parentSkuFalseCount};
            }
          }
        });
      }else{
  			console.log("parent sku object: ",parentSkuObj);
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'createProductInventoryModal.html',
          controller: 'createProductInventoryModalController',
          size: size,
          resolve: {
            luxireStock: function () {
              return {count:$scope.modalCount, data: $scope.luxireStock, parent_sku_obj:parentSkuObj, sku_status:$scope.parentSkuStatus};
            }
          }
        });
      }


      modalInstance.result.then(function (luxireStock) {
        $scope.luxireStock = luxireStock;
  			$scope.parentSkuFalseCount++;
        $scope.dummyInventoryData=$scope.luxireStock;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


  	$scope.createProduct = function() {
  		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
  		if($scope.parentSkuStatus==true){
  				$scope.postProductData={};
  				$scope.product["luxire_product_attributes"] = {};
  				$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  				$scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxireStock.id;
  				$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;
  				$scope.postProductData["product"]=$scope.product;
  				products.createProduct($scope.postProductData).then(function(data){
  		      alert('Product successfully added');
  		      $scope.activeButton('products')
  		    }, function(info) {
  		      console.log(info);
  		    })

  				products.updateStock($scope.luxireStock.id,$scope.luxireStock).then(function(data){
  		      alert('inventory successfully updated');
  		      $scope.activeButton('products')
  		    }, function(info) {
  		      console.log(info);
  		    })



  		}else{

  		$scope.postProductData={};
  		//$scope.postProductData["product"]={};
  		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
  		$scope.product["luxire_product_attributes"] = {};
  		$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  		//$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = {};
  		$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = $scope.luxireStock;
  		$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;

  		$scope.postProductData["product"]=$scope.product;

  		$scope.modalCount=0;
      //console.log(" create product false part \nbefore posting the product data is: ",$scope.postProductData);
      products.createProduct($scope.postProductData).then(function(data){
        alert('Product successfully added');
        $scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })
    }
  }
});
