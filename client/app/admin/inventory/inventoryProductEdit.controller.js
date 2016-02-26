angular.module('luxire')
.controller('inventoryProductEditController',function($scope, $state, $stateParams, luxireStocks, products){

    //console.log("params id: "+$stateParams.id);
    console.log("params obj: ",$state.params.obj);
    $scope.inventoryRelatedProductsIds=[];
    $scope.inventoryProductObj=[];
    //$scope.inventoryRelatedProductsArr=[];
    $scope.inventoryRelatedProductsIds=$state.params.obj.product_ids;
    console.log("ids are: ",$scope.inventoryRelatedProductsIds);
    $scope.allProductsDataObj='';

      products.getProducts().then(function(data) {
        console.log('get all product api is calling...');
        console.log("data\n",data);
        $scope.allProductsDataObj = data.data.products;
        //$scope.loading = false;
        console.log("all product obj: ",$scope.allproductsDataObj);
      }, function(info){
        console.log(info);
      })


    $scope.productFilter=function(product){
      //console.log("material filter is calling with product price: "+product.luxire_product.material);
      for(i=0;i<$scope.inventoryRelatedProductsIds.length;i++){
          if(product.id == $scope.inventoryRelatedProductsIds[i]){
              console.log(" product Filtered :"+product.id);
              return product;
          }else{
          }

      }
      return '';
    }

    $scope.showEditProducts=function(inventory){
      console.log("selected inventory id:  "+inventory.id);
        $state.go("admin.edit_product",{id :inventory.id});
    }
});
