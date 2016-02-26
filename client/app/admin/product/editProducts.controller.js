angular.module('luxire')
.controller('editProductController',function($scope, products, fileReader, prototypeObject, $state, $stateParams, $uibModal, $log, editModalService){
  $scope.luxire_stock='';
  $scope.luxire_product={};
  $scope.parentSkuObj='';

  console.log("state params : "+$stateParams.id);
  products.getProductByID($stateParams.id).then(function(data) {
    $scope.products = data;
    $scope.luxire_stock = data.luxire_stock;
    $scope.luxire_product = data.luxire_product;
    $scope.parentSkuObj = $scope.luxire_stock;
    /*$scope.products.name = $scope.product.name;
    $scope.products.description = $scope.product.description;
    $scope.products.price= $scope.product.price;
    $scope.products.display_price = $scope.product.display_price;*/

    console.log("parent sku object",$scope.parentSkuObj);
    //console.log("data: \n",$scope.products);
    console.log(" luxire stock: \n",$scope.luxire_stock);
    console.log("luxire product: \n",$scope.luxire_product);

  }, function(info){
    console.log(info);
  })

  // ********************  START OF EDIT INVENTORY MODAL  ************************
  $scope.modalCount=0;
	$scope.animationsEnabled = true;
	$scope.dummyInventoryData='';


  $scope.luxireStock='';
	$scope.parentSkuStatus='';
	$scope.parentSkuFalseCount=0;
	var productTypeId='';
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

  $scope.openModal = function (size) {
    //$scope.parentSkuObj = luxireStock;
    $scope.modalCount++;
    console.log("modal count: "+$scope.modalCount);
    if($scope.modalCount>1){
			console.log("parent sku object: ",$scope.parentSkuObj);
      console.log("dummy data is : ",$scope.dummyInventoryData);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editModalContent.html',
        controller: 'editModalInstanceCtrl',
        size: size,
        resolve: {
          luxireStock: function () {
            return { count:$scope.modalCount,data:$scope.dummyInventoryData};
          }
        }
      });
    }else{
      //$scope.parentSkuObj = luxireStock;
			console.log("parent sku object: ",$scope.parentSkuObj);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editModalContent.html',
        controller: 'editModalInstanceCtrl',
        size: size,
        resolve: {
          luxireStock: function () {
            return {count:$scope.modalCount, data: $scope.products.luxire_stock};
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

  // ********************  END OF EDIT INVENTORY MODAL  ************************

  $scope.editProduct=function(){
        $scope.product={};
        $scope.product["name"]=$scope.products.name;
        $scope.product["description"]=$scope.products.description;
        $scope.product["price"]=$scope.products.price;
        $scope.product["display_price"]=$scope.products.display_price;
        $scope.product["shipping_category_id"]=1;

        console.log("in fun edit product : \nproduct object:\n",$scope.product);
        console.log("luxire_product object: \n",$scope.luxire_product);
        console.log("luxire stock obj:\n",$scope.luxireStock);
        $scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
    //if($scope.parentSkuStatus==true){
        console.log("edit product true part...");
        $scope.postProductData={};
        $scope.product["luxire_product_attributes"] = {};
        $scope.product["luxire_product_attributes"]=$scope.luxire_product;
        $scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxire_stock.id;
        //$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = $scope.luxireStock;
        $scope.product["luxire_product_attributes"]["luxire_product_type_id"] = 1199;
        $scope.postProductData["product"]=$scope.product;
        console.log("inventory id: "+$scope.luxire_stock.id);
        console.log(" edit product true part\n before posting the product data is: ",$scope.postProductData);
        var data=JSON.stringify($scope.postProductData);
        console.log("data: \n",data);

        console.log("**** id : ",$scope.products.id);
        console.log("**** object  : ",$scope.postProductData);

        products.editProduct($scope.products.id,$scope.postProductData).then(function(data){
          console.log("node response: ",data);
          alert('Product successfully updated...');
          $scope.activeButton('products')
        }, function(info) {
          console.log(info);
        })

        products.updateStock($scope.luxire_stock.id,$scope.luxireStock).then(function(data){
          alert('inventory successfully updated...');
          $scope.activeButton('products')
        }, function(info) {
          console.log(info);
        })



    //}

    /*else{

    $scope.postProductData={};
    //$scope.postProductData["product"]={};
    $scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
    $scope.products["luxire_product_attributes"] = {};
    $scope.products["luxire_product_attributes"]=$scope.luxireProduct;
    //$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = {};
    $scope.products["luxire_stock_attributes"] = $scope.luxireStock;
    $scope.products["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;

    $scope.postProductData["product"]=$scope.products;

    $scope.modalCount=0;
    console.log(" create product false part \nbefore posting the product data is: ",$scope.postProductData);
    /*products.createProduct($scope.postProductData).then(function(data){
      alert('Product successfully added');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }*/
  }

});
