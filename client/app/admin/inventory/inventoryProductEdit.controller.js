angular.module('luxire')
.controller('inventoryProductEditController',function($scope, $state, $timeout, $stateParams, luxireStocks, products){

    $scope.noProductMsg=false;
    $scope.loading = true;
    luxireStocks.luxireStocksById($stateParams.id).then(function(data) {
      $scope.products = data.data.product;
      $scope.parentSku = data.data.parent_sku;
      if(data.data.product.length == 0){
        $scope.noProductMsg=true;
      }
      $scope.loading = false;
    }, function(info){
      console.log(info);
      $scope.loading = false;
    })
    $scope.deleteProducts = function(id,index) {
      products.deleteProduct(id).then(function(data){
        $scope.alerts.push({type: 'success', message: 'Product Deleted successfully!'});
  			$scope.allInventoryRelatedProducts.product.splice(index,1);
        $timeout(function() {
          //console.log("timeout functionality...");
          $state.go("admin.inventoryProductEdit");

        }, 3000);
        //alert('Product deleted successfully');
        $scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })
    }

    $scope.showEditProducts=function(inventory){
        $state.go("admin.edit_product",{id :inventory.id});
    }
});
