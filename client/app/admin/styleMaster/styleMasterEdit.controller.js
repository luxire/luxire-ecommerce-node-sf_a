angular.module('luxire')
.controller('styleMasterEditController',function($scope,styleMasterService,$state,$stateParams){
  $scope.styleMasterByIdValue='';
  $scope.newProductType='';
  $scope.selectedType=[];
  $scope.allMeasurementType=[];
  $scope.productType='';
  $scope.values={};
   var productTypeId='';

  console.log(" in style master edit state params: "+$stateParams.id);
  styleMasterService.getStyleMasterById($stateParams.id).then(function(data){
     console.log("style master value is\n\n",data.data);
     $scope.styleMasterByIdValue=data.data;
     $scope.newProductType=data.data;
     $scope.values = data.data.default_values;
     console.log("+++ default values in style master by id fun +++\n\n",$scope.values);

     $scope.productType=data.data.luxire_product_type.product_type;
     productTypeId=data.data.luxire_product_type.id;
     console.log("product id : "+productTypeId);
     console.log("product type: "+$scope.productType);
     styleMasterService.getProductTypeById(productTypeId).then(function(data) {
     //$scope.loading= false;
     console.log("product type by id value : ",data.data);
     $scope.allMeasurementType = data.data.luxire_product_attributes;
     console.log("selected product type value is \n",$scope.allMeasurementType);

      }, function(info){
     console.log(info);
      });


      for(var keyName in data.data.default_values){
         var key=keyName;
         console.log("key: "+key);
         var value=data.data.default_values[keyName];
         for(nestedKeyName in value ){
           var nestedKey=nestedKeyName;
           var nestedValue=value[nestedKeyName];
           $scope.selectedType.push({ name : nestedKey, value: nestedValue });
         }
         console.log("value: ",value);


     }
      $scope.selectDefault=$scope.selectedType;
      console.log("************* select default:  \n\n",$scope.selectDefault);
   }, function(info) {
     console.log(info);
   })




   /*$scope.allproductType='';
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
   })*/

   /*styleMasterService.getAllMeasurementType().then(function(data) {
     //$scope.loading= false;
     console.log("values of all measurement type \n\n");
     $scope.allMeasurementType=data.data;
     console.log("\n\nall product type values are \n\n",data.data);
     for(i=0;i<$scope.allMeasurementType.length;i++){
         console.log("measurement type: "+$scope.allMeasurementType[i].name);
     }
   }, function(info){
     console.log(info);
   })*/


   $scope.selectedMeasurementType=function(product){

     if($scope.selectDefault.length==0)
          return '';
    else{
     for(var i=0;i<$scope.selectDefault.length;i++){
       if(product.name == $scope.selectDefault[i].name){
          product.selectDefaultValue=$scope.selectDefault[i].value;
          return product;
       }
     }

     return product;
   }
   }

   //$scope.values={};
   /*$scope.default_value={};
   var customization_attributes={};
   var personalization_attributes={};
   var standard_mesurement_attributes={};
   var body_mesurement_attributes={};*/
   $scope.showMeasurementType=function(key,name,value,defaultObj){
     console.log($scope.values);
      console.log("select measurement type is calling.. : ");
      console.log("key: "+key);
      console.log("name: "+name);
      console.log("value: "+value);
      console.log("default value: ",defaultObj);

     if(key == 'customization'){
        $scope.values.customization_attributes[name]=value;

     }else if(key == 'personalization'){
       $scope.values.personalization_attributes[name]=value;

     }else if(key == 'standard'){
       $scope.values.standard_mesurement_attributes[name]=value;

     }else if(key == 'body'){
       $scope.values.body_mesurement_attributes[name]=value;

     }
    //  $scope.default_value=defaultObj;
   }


   $scope.save=function(){
     console.log("in save default values are\n",$scope.values);
     console.log("new product type :\n",$scope.newProductType);
     //console.log("default_values: \n",$scope.default_values);
     $scope.newProductType["default_values"]=$scope.values;
     console.log(" before posting the new product type obj is  :\n",$scope.newProductType);
     styleMasterService.updateStyleMasterById($stateParams.id,$scope.newProductType).then(function(data){
        alert('style master is updated successfully added');
        //$scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })

   }


});
