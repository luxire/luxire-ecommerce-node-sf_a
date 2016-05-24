angular.module('luxire')
.controller('ProductTypeController',function($scope,productTypeService,prototypeObject,$state,$stateParams,$window, ImageHandler, $timeout){

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
$scope.measurement_type_ids=[];

// Image upload feature
$scope.upload_image = function(files){
  if (files && files.length) {
    $scope.product_type_image = files[0];
    var reader = new FileReader();
     reader.onload = function (e) {
         $('#product_type_image').attr('src', e.target.result);
     }
     reader.readAsDataURL(files[0]);
  }
}

$scope.getImage = function(url){
  return ImageHandler.url(url);
};

//Listing the data in home page
$scope.loading = true;
console.log('----------Test-----');
productTypeService.getProductTypes().then(function(data) {
  console.log('----------', data);
    $scope.productTypeJsonResponse = data;
    $scope.loading = false;
  console.log($scope.productTypeJsonResponse);
}, function(info){
  console.log(info);
})

//Link to the edit page on clicking on the product type
$scope.showEditProdTypes=function(id){
  $state.go("admin.editProductType",{id: id});
}

//Deleting
$scope.deleteProductTypes = function(id,index) {

  productTypeService.deleteProductType(id).then(function(data){
    $scope.productTypeJsonResponse.data.splice(index,1);
    $scope.alerts.push({type: 'success', message: 'Product Type deleted successfully!'});
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
      }
    })
  }

//Loading the attributes from MeasurementType API
$scope.loading = true;
productTypeService.getMeasurementTypes().then(function(data) {
  $scope.measurementTypeJson = data;
  $scope.loading = false;
}, function(info){
  console.log(info);
})

//function for ng-change
$scope.myFunc = function(status,id){
  if(status == true)
    $scope.measurement_type_ids.push(id);
  else {
    $scope.measurement_type_ids.splice($scope.measurement_type_ids.indexOf(id), 1);
  }
}

$scope.productTypeData = {};
//function to create a product type
$scope.createProductType = function() {
  if( $scope.productTypeData.product_type == undefined ||
      $scope.productTypeData.product_type == ''){
      document.getElementById("name").focus();
      $scope.alerts.push({type: 'danger', message: 'name can not be empty!'});
    }
    else if($scope.product_type_image == undefined ||
    $scope.product_type_image == ''){
      document.getElementById("prod_input_image").focus();
      $scope.alerts.push({type: 'danger', message: 'image can not be empty!'});

    }
    // else if$scope.length_required == undefined ||
    // $scope.length_required == ''){
    //   document.getElementById("length").focus();
    //   $scope.alerts.push({type: 'danger', message: 'length can not be empty!'});
    //
    // }
    else{
          $scope.selectedAttributes = [];
          angular.forEach($scope.measurementTypeJson.data, function(attribute){
            if (attribute.selected == true){
              $scope.selectedAttributes.push(attribute.id);
            }
          })
          $scope.productTypeData.measurement_type_ids = $scope.measurement_type_ids;
          productTypeService.createProductType($scope.productTypeData).then(function(data){
            if($scope.product_type_image){
              //update image  function
            productTypeService.update_image($scope.product_type_image,data.data.id).then(function(data){

        }, function(error) {
            console.log(error);

          });
        }
          $scope.alerts.push({type: 'success', message: 'Product Type added successfully!'});
          $timeout(function(){
            $state.go('admin.productTypes');
          }, 3000)

        }, function(error){
            $scope.alerts.push({type: 'danger', message: 'Product Type creation failed!'});

        });
      }
    }
  })




.controller('editProductTypeController',function($scope,productTypeService,prototypeObject,$state,$stateParams,$window, ImageHandler, $timeout){

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
 $scope.measurement_type_ids=[];
  $scope.productTypeData = {product_type:'', description: '', measurement_type_ids: []};

/* upload image*/
  $scope.upload_image = function(files){
    if (files && files.length) {
      $scope.product_type_img = files[0];
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#product_type_image').attr('src', e.target.result);
       }
       reader.readAsDataURL(files[0]);
    }
  }

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };


  $scope.loading = true;
  //binding the data to edit view

  productTypeService.getProductTypeById($stateParams.id).then(function(res){
    console.log('________________', res);
     $scope.productTypeData.product_type = res.data.product_type;
     $scope.productTypeData.description = res.data.description;
     $scope.measurement_type_ids = [];
     /* upload image code*/
     $('#product_type_image').attr('src', ImageHandler.url(res.data.image));
    //  delete res.data.image;
     $scope.measurement_type_ids = res.data.luxire_product_attributes_ids;
     productTypeService.getMeasurementTypes().then(function(data) {
     $scope.measurementTypeJson = data;
     angular.forEach($scope.measurementTypeJson.data,function(value,key){
         angular.forEach(value, function(attribute){
         if($scope.measurement_type_ids.indexOf(attribute.id)!= -1){
            attribute.selected = true;
          }else{
              attribute.selected = false;
          }
        })
      })
      $scope.loading = false;
     }, function(info){
       console.log(info);
     })
       }, function(info) {
     console.log(info);
   })

//update function to updtae the product type
  $scope.updateProductType = function(id) {
    console.log("name:",$scope.productTypeData.product_type);
    if( $scope.productTypeData.product_type == ''){
        document.getElementById("name").focus();

        $scope.alerts.push({type: 'danger', message: 'name cannot be empty!'});
      }
      else if($scope.product_type_image == ''){
        document.getElementById("prod_input_image").focus();
        $scope.alerts.push({type: 'danger', message: 'image cannot be empty!'});
      }
      else{
    $scope.selectedAttributes = [];
    angular.forEach($scope.measurementTypeJson.data, function(val, key){
      angular.forEach(val, function(attribute){
        if (attribute.selected == true){
          $scope.selectedAttributes.push(attribute.id);
        };
      })
    });
    $scope.productTypeData.measurement_type_ids = $scope.selectedAttributes;
    productTypeService.updateProductType($stateParams.id,$scope.productTypeData).then(function(data){
      if($scope.product_type_img){
          //function to update image
          productTypeService.update_image($scope.product_type_img,data.data.id).then(function(data){

         }, function(error) {
            $scope.alerts.push({type: 'danger', message: 'Product Type updation failed!'});
            });
        }
      $scope.alerts.push({type: 'success', message: 'Product Type updated successfully!'});
      $timeout(function(){
        $state.go('admin.productTypes');
      }, 3000)
    }, function(error) {

      })
  }
}

});
