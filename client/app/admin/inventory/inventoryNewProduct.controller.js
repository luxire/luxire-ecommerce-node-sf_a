angular.module('luxire')
.controller('inventoryNewProductController',function($scope, $state, $stateParams, products, createProductModalService, $uibModal, $log){

    console.log("state params parent sku is: ",$stateParams.sku);
    $scope.parentSku = $stateParams.sku;
    $scope.modalCount=0;
  	$scope.animationsEnabled = true;
  	$scope.dummyInventoryData='';


    $scope.luxireStock='';
  	$scope.parentSkuStatus='';
  	$scope.parentSkuFalseCount=0;
  	var productTypeId='';
  	var parentSkuObj='';
  	products.allProductType().then(function(data) {
  		//$scope.loading= false;
  		console.log("values of all product type \n\n");
  		$scope.allproductType=data.data;
  		console.log("\n\nall product type values are \n\n",data.data);
  		for(i=0;i<$scope.allproductType.length;i++){
  				console.log("product type: "+$scope.allproductType[i].product_type);
  		}
  	}, function(info){
  		console.log(info);
  	})

  	$scope.showProductType=function(){
  		console.log("select product type is calling..");
  		 console.log("selected product type is "+$scope.newProductType.type);
  		 productTypeId=$scope.newProductType.type;
  		 console.log("selected product type id: "+productTypeId);

  	}


    /*$scope.checkParentSku=function(sku){
      console.log("checkParentSku fun is calling 1...");
      var parentSku={
        parent_sku: sku,
      }
      createProductModalService.checkParentSku(parentSku).then(function(res){
         //console.log(" parent sku response is: ",res.msg);
         $scope.parentSkuStatus=res.msg;
         if($scope.parentSkuStatus == "false") {
             console.log("parent sku false part");
  					 console.log("sku status: ",$scope.parentSkuStatus);
  					 parentSkuObj = parentSku;
  					 $scope.parentSkuFalseCount=0;
  					 console.log("perentskuObj: ",parentSkuObj);
  					 //$scope.parentSkuFalseCount++;
  					 //$scope.luxireStock={};

         }else{
  				 console.log("parent sku true part..");
  				 $scope.parentSkuStatus=true;
           $scope.luxireStock=res;
  				 $scope.parentSkuFalseCount=0;
  				 console.log("+++++++++++++++++false count: "+$scope.parentSkuFalseCount);
  				 parentSkuObj = $scope.luxireStock;
  				 console.log("sku status: ",$scope.parentSkuStatus);
  					console.log("luxire stock object: ",$scope.luxireStock);
         }

       }, function(info) {
         console.log(info);
       })

    }*/

    var parentSkuObj={
      parent_sku: $scope.parentSku,
    }
    $scope.openModal = function (size) {
      $scope.modalCount++;
      console.log("modal count: "+$scope.modalCount);
      if($scope.modalCount>1){
  			console.log("parent sku object: ",parentSkuObj);
        console.log("dummy data is : ",$scope.dummyInventoryData);
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
        console.log("modal return value is : ",$scope.luxireStock);
  			$scope.parentSkuFalseCount++;
        $scope.dummyInventoryData=$scope.luxireStock;
  			console.log("dummy result: ",$scope.dummyInventoryData);
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


  	$scope.createProduct = function() {
      console.log("in fun create product : \nproduct object:\n",$scope.product);
  		console.log("luxire_product object: \n",$scope.luxireProduct);
  		console.log("luxire stock obj:\n",$scope.luxireStock);
  		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
  		if($scope.parentSkuStatus==true){
  				console.log("create product true part...");
  				$scope.postProductData={};
  				$scope.product["luxire_product_attributes"] = {};
  				$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  				$scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxireStock.id;
  				$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;
  				$scope.postProductData["product"]=$scope.product;
  				console.log("inventory id: "+$scope.luxireStock.id);
  				console.log(" create product true part\n before posting the product data is: ",$scope.postProductData);
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
      console.log(" create product false part \nbefore posting the product data is: ",$scope.postProductData);
      products.createProduct($scope.postProductData).then(function(data){
        alert('Product successfully added');
        $scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })
    }
  }
});
