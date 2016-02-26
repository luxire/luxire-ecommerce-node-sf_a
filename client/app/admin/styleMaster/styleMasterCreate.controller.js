angular.module('luxire')
.controller('styleMasterCreateController',function($scope,styleMasterService){

  $scope.allproductType='';
  $scope.allMeasurementType={};
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

  /*styleMasterService.getAllMeasurementType().then(function(data) {
    //$scope.loading= false;
    console.log("values of all measurement type \n\n");
    $scope.allMeasurementType=data.data.luxire_product_attributes;
    console.log($scope.allMeasurementType);
    /*console.log("\n\nall product type values are \n\n",data.data);
    for(i=0;i<$scope.allMeasurementType.length;i++){
        console.log("measurement type: "+$scope.allMeasurementType[i].name);
    }
  }, function(info){
    console.log(info);
  })*/

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
      console.log("selected product type is "+$scope.newProductType.luxire_product_type_id);
      var id=$scope.newProductType.luxire_product_type_id;
        styleMasterService.getProductTypeById(id).then(function(data) {
        //$scope.loading= false;
        $scope.allMeasurementType = data.data.luxire_product_attributes;
        console.log("selected product type value is \n",$scope.allMeasurementType);

      }, function(info){
        console.log(info);
      });

   }


   $scope.default_values={};
   var customization_attributes={};
   var personalization_attributes={};
   var standard_mesurement_attributes={};
   var body_mesurement_attributes={};
   $scope.showMeasurementType=function(key,name,value){
     console.log("select measurement type is calling.. : ");
     console.log("key: "+key);
     console.log("name: "+name);
     console.log("value: "+value);
     if(key == 'customization'){
        customization_attributes[name]=value;

     }else if(key == 'personalization'){
       personalization_attributes[name]=value;

     }else if(key == 'standard'){
       standard_mesurement_attributes[name]=value;

     }else if(key == 'body'){
       body_mesurement_attributes[name]=value;

     }
     console.log("****** default values *******\n\n",$scope.default_values);
   }

   $scope.save=function(){
     $scope.default_values["customization_attributes"]=customization_attributes;
     $scope.default_values["personalization_attributes"]=personalization_attributes;
     $scope.default_values["standard_mesurement_attributes"]=standard_mesurement_attributes;
     $scope.default_values["body_mesurement_attributes"]=body_mesurement_attributes;

     console.log("new product type :\n",$scope.newProductType);
     console.log("default_values: \n",$scope.default_values);

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
