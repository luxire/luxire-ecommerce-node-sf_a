angular.module('luxire')
.controller('styleMasterEditController',function($scope,styleMasterService,$state,$stateParams){
  $scope.styleMasterByIdValue='';
  $scope.newProductType='';
  $scope.selectedType=[];
  console.log(" in style master edit state params: "+$stateParams.id);
  styleMasterService.getStyleMasterById($stateParams.id).then(function(data){
     console.log("style master value is\n\n",data.data);
     $scope.styleMasterByIdValue=data.data;
     $scope.newProductType=data.data;
     $scope.values = data.data.default_values;
     console.log("new product type ",$scope.newProductType);

     for(var keyName in data.data.default_values){
       var key=keyName;
       var value=data.data.default_values[keyName];
       $scope.selectedType.push({ name : keyName, value: value });
     }
    //  console.log("selected type arr : ",$scope.selectedType[0].value);
     $scope.selectDefault=$scope.selectedType;
   }, function(info) {
     console.log(info);
   })


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


   $scope.selectedMeasurementType=function(product){
     if($scope.selectedType.length==0)
          return '';
    else{
     for(i=0;i<$scope.selectedType.length;i++){
       if(product.name == $scope.selectedType[i].name){
          console.log("product type: "+product.name)
          console.log("selected type: "+$scope.selectedType[i].name)

         return product;

       }
     }
     return '';
   }
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
     $scope.newProductType["default_values"]=$scope.default_values;
     console.log(" before posting the new product type obj is  :\n",$scope.newProductType);
     styleMasterService.updateStyleMasterById($stateParams.id,$scope.newProductType).then(function(data){
        alert('style master is updated successfully added');
        //$scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })

   }


});
