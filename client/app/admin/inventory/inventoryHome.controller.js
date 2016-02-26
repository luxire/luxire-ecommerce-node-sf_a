angular.module('luxire')
.controller('inventoryHomeController',function($scope, products, fileReader, prototypeObject, $state, luxireStocks){
$scope.hideAdd=true;
//$scope.hideSave=true;
$scope.reverse=false;
var count=0;
$scope.example={
  "value": 0
};
$scope.predicate="physical_count_on_hands";

$scope.productVariantObj=[
    {
      "id": 1,
      "name":"Diamond Blue Cotton",
      "imgurl":"//cdn.shopify.com/s/files/1/0979/1748/products/rel_prod_1_thumb.png?v=1441602043",
      "sku":"DIA001",
      "description":"Its a beautifull diamond blue cotton shirt.",
      "soldout":"stop selling",
      "incoming":0,
      "price":'120$',
      "display_price":'130$',
      "barcode":'ISBN007',
      "quantity":25,
      "weight": 230,
      "prodType":[
        {
          "name":"shirts"
        },{
          "name":"Gift Cards"
        }
      ],
      "vendor":[
        {
          "name":"Luxire"
        },{
          "name":"Diamond Textiles"
        },{
          "name":"Shopify"
        }
      ],
      "hidequantity":false
    },
    {
      "id": 2,
      "name":"Diamond Blue checks",
      "imgurl":"//cdn.shopify.com/s/files/1/0979/1748/products/rel_prod_3_thumb.png?v=1441601691",
      "sku":"LUX001",
      "description":"Its a beautifull diamond blue check shirt.",
      "soldout":"stop selling",
      "incoming":34,
      "price":'150$',
      "display_price":'160$',
      "barcode":'ISBN008',
      "quantity":15,
      "weight": 250,
      "prodType":[
        {
          "name":"shirts"
        },{
          "name":"Gift Cards"
        }
      ],
      "vendor":[
        {
          "name":"Luxire"
        },{
          "name":"Diamond Textiles"
        },{
          "name":"Shopify"
        }
      ],
      "hidequantity":false
    }
];
//*******  start inventory update part ***********
$scope.inventoryObj=[];
luxireStocks.luxireStocksIndex().then(function(data) {
  console.log(' from admin inventory home  response is: ');
  console.log(data);
  $scope.inventoryObj=data.data;
}, function(err){
 console.log(err);
})

$scope.sortQuantity=function(){
  console.log("sort fun is calling..");
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
    console.log("count: "+variant.physical_count_on_hands);
    console.log("set value: "+variant.set_value);
    variant.physical_count_on_hands=variant.physical_count_on_hands+variant.set_value;
    console.log("after add  "+variant.physical_count_on_hands);
    var luxire_stock={};
    luxire_stock["luxire_stock"]={};
    luxire_stock["luxire_stock"]["count"]=variant.set_value;
    luxire_stock["luxire_stock"]["parent_sku"]=variant.parent_sku;
    console.log("before posting...",luxire_stock);

    luxireStocks.luxireStocks_addQuantity(luxire_stock).then(function(data) {
      alert("add quantity sucessfully...");
      console.log(data);
    }, function(err){
     console.log(err);
    })

    variant.set_value='';
}
$scope.setQuantityValue=function(variant){
    console.log("count: "+variant.physical_count_on_hands);
    console.log("set initial: "+variant.setInitial);
    variant.physical_count_on_hands=variant.setInitial;
    console.log("after set  "+variant.physical_count_on_hands);
    var luxire_stock={};
    luxire_stock["luxire_stock"]={};
    luxire_stock["luxire_stock"]["count"]=variant.setInitial;
    luxire_stock["luxire_stock"]["parent_sku"]=variant.parent_sku;
    console.log("before posting...",luxire_stock);

    luxireStocks.luxireStocks_setQuantity(luxire_stock).then(function(data) {
      alert("set quantity sucessfully...");
      console.log(data);
    }, function(err){
     console.log(err);
    })
    variant.setInitial='';

}

$scope.showEditProducts=function(inventory){
  console.log("selected inventory id:  "+inventory.id);
  if(inventory.product_ids.length>=1){
    console.log("inventoryProductEdit...........");
    $state.go("admin.inventoryProductEdit",{obj: inventory});
  }else{
    $state.go("admin.edit_product",{id :inventory.id});

  }
}


//*******  end inventory update part ***********

});
