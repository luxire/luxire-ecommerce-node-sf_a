angular.module('luxire')
.controller('inventoryProductEditController',function($scope, $state, $stateParams, luxireStocks, products){

    //console.log("params id: "+$stateParams.id);
    $scope.noProductMsg=false;
    console.log("state params id is : ",$stateParams.id);
    luxireStocks.luxireStocksById($stateParams.id).then(function(data) {
      console.log("stocks by id is calling..");
      console.log("data\n",data);
      $scope.allInventoryRelatedProducts = data.data;
      if(data.data.product.length == 0){
        $scope.noProductMsg=true;
        $scope.parentSku = data.data.parent_sku;
      }else{
        console.log("all inventory related product obj: ",$scope.allInventoryRelatedProducts);
      }
      //$scope.loading = false;
    }, function(info){
      console.log(info);
    })

    /*$scope.inventoryRelatedProductsIds=[];
    $scope.inventoryProductObj=[];
    //$scope.inventoryRelatedProductsArr=[];
    $scope.inventoryRelatedProductsIds=$state.params.obj.product_ids;
    console.log("ids are: ",$scope.inventoryRelatedProductsIds);
    $scope.allProductsDataObj=[];

      products.getProducts().then(function(data) {
        console.log('get all product api is calling...');
        console.log("data\n",data);
        $scope.allProductsDataObj = data.data.products;
        //$scope.loading = false;
        console.log("all product obj: ",$scope.allProductsDataObj);
      }, function(info){
        console.log(info);
      })


    $scope.productFilter=function(product){
      for(i=0;i<$scope.inventoryRelatedProductsIds.length;i++){
          if(product.id === $scope.inventoryRelatedProductsIds[i]){
              console.log(" product Filtered :"+product.id);
              return product;
          }
      }
      return '';
    }*/
    $scope.showEditInventory=function(parentSku){
      console.log("no product parent sku is: ",parentSku);
      $state.go("admin.inventoryNewProduct",{sku: parentSku});
    }
    $scope.showEditProducts=function(inventory){
      console.log("selected inventory id:  "+inventory.id);
        $state.go("admin.edit_product",{id :inventory.id});
    }
});
