angular.module('luxire')
.controller('styleMasterCreateController',function($scope,styleMasterService){

  $scope.allproductType='';
  styleMasterService.getAllProductType().then(function(data) {
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

  styleMasterService.getAllMeasurementType().then(function(data) {
    //$scope.loading= false;
    console.log("values of all measurement type \n\n");
    $scope.allMeasurementType=data.data;
    console.log("\n\nall product type values are \n\n",data.data);
    for(i=0;i<$scope.allMeasurementType.length;i++){
        console.log("measurement type: "+$scope.allMeasurementType[i].name);
    }
  }, function(info){
    console.log(info);
  })
  $scope.desc="*****8";

  $scope.selectedType=[];
  $scope.selectedMeasurementType=function(product){
    if($scope.selectedType.length==0)
         return '';
   else{
    var temp=[];
    for(i=0;i<$scope.selectedType.length;i++){
      if(product.name === $scope.selectedType[i])
           return product;
    }
    return '';
  }
  }

    $scope.images='';

   $scope.showProductType=function(){
     console.log("select product type is calling..");
      console.log("selected product type is "+$scope.newProductType.type);
      var id=$scope.newProductType.type;
      styleMasterService.getProductTypeById(id).then(function(data) {
        //$scope.loading= false;
        console.log("selected product type value is \n",data.data.measurement_types);
          for(i=0;i<data.data.measurement_types.length;i++){
              $scope.selectedType[i]=data.data.measurement_types[i].name;
          }
          console.log("selected type: "+$scope.selectedType);
      }, function(info){
        console.log(info);
      });

   }


   $scope.default_values={};
   $scope.showMeasurementType=function(name,value){
     console.log("select measurement type is calling.. : ");
     console.log("name: "+name);
     console.log("value: "+value);
     //$scope.default_values.push({name : name, value: value});
     $scope.default_values[name]=value;
      //console.log("selected item is "+$scope.key);

   }

   $scope.save=function(){
     console.log("new product type :\n",$scope.newProductType);
     console.log("default_values: \n",$scope.default_values);
     //angular.extend($scope.newProductType.default_values,$scope.default_values);
     //console.log(" after extend new product type :\n",$scope.newProductType);
     $scope.newProductType["default_values"]=$scope.default_values;
     console.log(" before posting the new product type obj is  :\n",$scope.newProductType);
     styleMasterService.createStyleMaster($scope.newProductType).then(function(data){
        alert('style master is successfully added');
        //$scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })

   }


});
