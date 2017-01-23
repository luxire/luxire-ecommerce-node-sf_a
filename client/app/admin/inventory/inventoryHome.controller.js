angular.module('luxire')
.controller('inventoryHomeController',function($scope, products, fileReader, prototypeObject, $state, luxireStocks){
  $scope.hideAdd=true;
  $scope.reverse=false;
  $scope.loading = true;
  var count=0;
  $scope.example={
    "value": 0
  };
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  $scope.predicate="physical_count_on_hands";
  //*******  start inventory update part ***********
  $scope.inventoryObj = [];
  $scope.noInventoryMsg = false;
  luxireStocks.luxireStocksIndex().then(function(data) {
    $scope.inventoryObj=data.data;
    if(data.data.length == 0){  // 18th march
      $scope.noInventoryMsg = true;
    }else{
      $scope.noInventoryMsg = false;
    }
    $scope.loading= false;
  }, function(err){
   console.log(err);
   $scope.loading= true;
 })

  $scope.sortQuantity=function(){
    $scope.predicate="quantity";
    count++;
    if(count % 2==0){
      $scope.reverse=true;
    }
    else {
      $scope.reverse=false;
    }
  }

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

  $scope.load_more_inventory = function(){
    console.log('scroll');
  }


  //*******  end inventory update part ***********

});
