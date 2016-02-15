angular.module('luxire')
.controller('ProductTypeController',function($scope,productTypeService,prototypeObject,$state,$stateParams,$window){

//Alerts to display the message
$scope.alerts = [];
var alert = function(){
  this.type = '';
  this.message = '';
};
$scope.close_alert = function(index){
  console.log(index);
  $scope.alerts.splice(index, 1);
};


//Loading all the data to Home page
$scope.loading = true;
productTypeService.getProductTypes().then(function(data) {
  console.log("Hey this is getProductTypes function of controller");
  console.log('admin');
  console.log('List of product types\n');
  console.log(data);
  $scope.productTypeJsonResponse = data;
  //for(i=0;i<data.data.length;i++){
  //  console.log("value: \n",data.data[i].id);
//  }
  $scope.loading = false;
  console.log($scope.productTypeJsonResponse);
}, function(info){
  console.log(info);
})
//Hyperlinks
$scope.showEditProdTypes=function(id){
  console.log("Id of prodType id in home: "+id);
  $state.go("admin.editProductType",{id: id});
}






//Deleting
$scope.deleteProductTypes = function(id,index) {
  console.log("Hello I'm in delete controller function");
  $scope.productTypeJsonResponse.data.splice(index,1);

  productTypeService.deleteProductType(id).then(function(data){
    $scope.alerts.push({type: 'success', message: 'Product Type deleted successfully!'});
    console.log("Hello I'm in delete controller function");
    console.log("Deleted data\n",data);
  //  alert('Product Type deleted successfully');
  //  $scope.activeButton('productTypes')

}, function(error) {
    console.log(error);
    $scope.alerts.push({type: 'danger', message: 'Deletion failed!'});
  })

}


//Load the data into checkboxes
  $scope.save = function(data){
    $scope.selectedAttributes = [];
    angular.forEach($scope.measurementTypeJson.data, function(attribute){
      if (attribute.selected == true){
        $scope.selectedAttributes.push(attribute.id);
        console.log(attribute.selected);
          console.log($scope.selectedAttributes);
        }
    })
    // console.log("elements in new array");

    // console.log($scope.selectedAttributes);

  }
//Loading the attributes from MeasurementType API


$scope.loading1 = true;
productTypeService.getMeasurementTypes().then(function(data) {
  console.log("Hey this is getMeasurementTypes function of controller");
  //console.log('admin');
  console.log('List of measurement types\n');
  console.log(data);
  $scope.measurementTypeJson = data;
  $scope.loading1 = false;
  console.log($scope.measurementTypeJson);
}, function(info){
  console.log(info);
})



//$scope.productTypeData  = new prototypeObject.productType();
//Creating productTypes

$scope.createProductType = function() {
  $scope.selectedAttributes = [];
  angular.forEach($scope.measurementTypeJson.data, function(attribute){
    if (attribute.selected == true){
      $scope.selectedAttributes.push(attribute.id);
      console.log(attribute.selected);
      console.log($scope.selectedAttributes);

    }
  })
  $scope.productTypeData.measurement_type_ids = $scope.selectedAttributes;
//   console.log($scope.productTypeData);
  productTypeService.createProductType($scope.productTypeData).then(function(data){

    //alert('Product type successfully added')

    $scope.alerts.push({type: 'success', message: 'Product Type added successfully!'});
     $state.go('admin.productTypes');

  //  $scope.activeButton('products')
}, function(error) {
    console.log(error);
    $scope.alerts.push({type: 'danger', message: 'Name of the product type should be unique!'});
  })
}
})
.controller('editProductTypeController',function($scope,productTypeService,prototypeObject,$state,$stateParams,$window){



  //Alerts to display the message
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };


  $scope.productTypeData = {};
  console.log($stateParams);
  productTypeService.getProductTypeById($stateParams.id).then(function(res){
     $scope.productTypeData.product_type = res.data.product_type;
     $scope.productTypeData.description = res.data.description;
     $scope.measurement_type_ids = [];
     angular.forEach(res.data.measurement_types,function(value){
       console.log(value.id);
       $scope.measurement_type_ids.push(value.id);

       console.log($scope.measurement_type_ids);
       productTypeService.getMeasurementTypes().then(function(data) {
         //console.log("Hey this is getMeasurementTypes function of controller");


         $scope.measurementTypeJson = data;
         angular.forEach($scope.measurementTypeJson.data,function(value,key){
          //  console.log(value.id);
          //  console.log($scope.measurementTypeJson.data);
          //  console.log("log is in loop");
          //  console.log('ids', $scope.measurement_type_ids);
          //  console.log('key', key);
          //  console.log('value', value);
           if($scope.measurement_type_ids.indexOf(value.id)!= -1){
             $scope.measurementTypeJson.data[key].selected = true;
           }
           else{
             $scope.measurementTypeJson.data[key].selected = false;
         }
         })
       }, function(info){
         console.log(info);
       })
     })

       }, function(info) {
     console.log(info);
   })


//  $scope.loading1 = true;
  $scope.showEditProdTypes=function(id){
    console.log("Id of prodType id in home: "+id);
    $state.go("admin.editProductType",{id: id});
  }


  $scope.updateProductType = function(id) {

    $scope.selectedAttributes = [];
//      $scope.productTypeJsonResponse = data;

    angular.forEach($scope.measurementTypeJson.data, function(attribute){
      // $scope.productTypeData.product_type = $scope.measurementTypeJson.data.product_type;
      // $scope.productTypeData.description = $scope.measurementTypeJson.data.description;
      // console.log($scope.measurementTypeJson);
      if (attribute.selected == true){
        $scope.selectedAttributes.push(attribute.id);
        console.log(attribute.selected);
        console.log($scope.selectedAttributes);
      }
    })
    $scope.productTypeData.measurement_type_ids = $scope.selectedAttributes;
    console.log($scope.productTypeData);
    productTypeService.updateProductType($stateParams.id,$scope.productTypeData).then(function(data){
      $scope.alerts.push({type: 'success', message: 'Product Type updated successfully!'});
       $state.go('admin.productTypes');
    //  alert('Product type successfully updated');
    //  $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }

});
