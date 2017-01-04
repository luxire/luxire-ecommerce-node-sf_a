angular.module('luxire')
.controller('ProductTypeController',function($scope,productTypeService,prototypeObject,$state,$stateParams,$window, ImageHandler, $timeout, $uibModal){
  //Listing the data in home page
  function loadProductTypes(){
    $scope.loading = true;
    productTypeService.getProductTypes().then(function(data) {
        $scope.productTypeJsonResponse = data.data;
        $scope.loading = false;
    }, function(info){
      console.log(info);
    })
  };
  loadProductTypes();

  //Alerts to display the message
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
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

  //Link to the edit page on clicking on the product type
  $scope.showEditProdTypes=function(id){
    $state.go("admin.editProductType",{id: id});
  }

  //Deleting
  $scope.deleteProductTypes = function(product_type, index) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'delete_product_type.html',
      controller: 'DeleteProductTypeController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        product_type: function () {
          return product_type;
        }
      }
    });
    modalInstance.result.then(function (product_type) {
      $scope.alerts.push({type: 'success', message: 'Deleted Product type '+product_type.product_type+' successfully!'});
      loadProductTypes();
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
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
  productTypeService.getMeasurementTypes().then(function(data) {
    $scope.measurementTypeJson = data;
  }, function(info){
    console.log(info);
  })

  $scope.add_new_product_type = function(){
    $state.go('admin.new_productTypes');
  };

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
    if( $scope.productTypeData.product_type == undefined || $scope.productTypeData.product_type == ''){
        document.getElementById("name").focus();
        $scope.alerts.push({type: 'danger', message: 'name can not be empty!'});
    }
    else if($scope.product_type_image == undefined || $scope.product_type_image == ''){
      document.getElementById("prod_input_image").focus();
      $scope.alerts.push({type: 'danger', message: 'image can not be empty!'});
    }
    else{
        $scope.selectedAttributes = [];
        angular.forEach($scope.measurementTypeJson.data, function(attribute){
          if (attribute.selected == true){
            $scope.selectedAttributes.push(attribute.id);
          }
        })
        $scope.productTypeData.measurement_type_ids = $scope.measurement_type_ids;
        $scope.loading = true;
        productTypeService.createProductType($scope.productTypeData).then(function(data){
            if($scope.product_type_image){
              //update image  function
                productTypeService.update_image($scope.product_type_image,data.data.id).then(function(data){
                  $scope.alerts.push({type: 'success', message: 'Product Type added successfully!'});
                  $scope.loading = false;
                  $state.go('admin.productTypes');
                  loadProductTypes();
                }, function(error) {
                console.log(error);
                });
            }
        }, function(error){
          console.error(error);
          $scope.loading = false;
          angular.forEach(error.data, function(value, key){
            angular.forEach(value, function(v, k){
              $scope.alerts.push({type: 'danger', message: key +' '+v});
            });
          })

        });
    }
  }
})
.controller('DeleteProductTypeController', function($scope, $uibModalInstance, product_type, productTypeService){
  $scope.product_type = product_type;
  $scope.delete = function () {
    $scope.loading = true;
    productTypeService.deleteProductType(product_type.id).then(function(data){
      $scope.loading = false;
      $uibModalInstance.close(product_type);
    }, function(error) {
      console.log(error);
      $scope.alerts.push({type: 'danger', message: 'Deletion failed!'});
    })

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})




.controller('editProductTypeController',function($scope,productTypeService,prototypeObject,$state,$stateParams,$window, ImageHandler, $timeout){

  //Alerts to display the message
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
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
     $scope.productTypeData.product_type = res.data.product_type;
     $scope.productTypeData.description = res.data.description;
     $scope.productTypeData.length_required = res.data.length_required;
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
      $scope.loading = true;
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
              $scope.loading = false;
              $scope.alerts.push({type: 'success', message: 'Product Type updated successfully!'});
              $state.go('admin.productTypes');
             }, function(error) {
                $scope.alerts.push({type: 'danger', message: 'Product Type updation failed!'});
                });
        }
        else{
          $scope.loading = false;
          $scope.alerts.push({type: 'success', message: 'Product Type updated successfully!'});
          $state.go('admin.productTypes');
        }
      }, function(error) {
        $scope.alerts.push({type: 'danger', message: 'Product Type updation failed!'});
      })
    }
  }

});
