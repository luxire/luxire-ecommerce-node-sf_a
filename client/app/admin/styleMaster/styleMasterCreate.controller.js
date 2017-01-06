angular.module('luxire')
.controller('styleMasterCreateController',function($scope, $state, $timeout, styleMasterService, ImageHandler, productSearch ){
  $scope.allMeasurementType={};
  $scope.newProductType={};
  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    $scope.alerts.splice(index, 1);
  };
  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.loading = true;
  styleMasterService.getAllProductType().then(function(data) {
    $scope.allproductType=data.data;
    $scope.loading = false;
  }, function(error){
    console.log(error);
    $scope.loading = false;

  })
  /*Image upload*/
  $scope.upload_image = function(files){
    if (files && files.length) {
      $scope.style_image = files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#style_master_img').attr('src', e.target.result);
      }
      reader.readAsDataURL(files[0]);
    }
  }

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.checkStyleMasterName = function(name){
    if(name == undefined || name == '' || name == 0){
      $scope.emptyNameMsg = true;
      document.getElementById("name").focus();
    }else{
      $scope.emptyNameMsg = false;
    }
  }
  // storing product type
  $scope.selectedProductType;
  $scope.showProductType=function(type){
    $scope.selectedProductType = $scope.luxire_product_type_id;
    $scope.loading= true;
    styleMasterService.getProductTypeById($scope.luxire_product_type_id).then(function(data) {
      $scope.loading= false;
      $scope.allMeasurementType = data.data.luxire_product_attributes;
    }, function(info){
      console.log(info);
      $scope.loading= false;
    });

  }
  var tagIdsObj=[];

  $scope.loadItems = function(query){
    return productSearch.searchProducts(query);
  };
  $scope.tagsInputChange = function(product){
  }

  $scope.style = {
    "customization_attributes": {},
    "personalization_attributes": {}
  };
  $scope.style_cost = {};
  $scope.restricted_params = ["image", "help", "cost"];
  $scope.add_style_cost = function(cost){
    angular.forEach(cost, function(value, currency){
      $scope.style_cost[currency] = $scope.style_cost[currency] ? $scope.style_cost[currency] + parseFloat(value) : parseFloat(value);
    });
  };
  $scope.remove_style_cost = function(cost){
    angular.forEach(cost, function(value, currency){
      $scope.style_cost[currency] = parseFloat($scope.style_cost[currency])  - parseFloat(value);
    });
  };

  $scope.change_defaults = function(attribute_type, attribute_name, attribute_details, meta_data_is_checked, meta_data_previous_value){
    attribute_details = attribute_details && angular.isString(attribute_details)? JSON.parse(attribute_details) : attribute_details;
    meta_data_previous_value = meta_data_previous_value && angular.isString(meta_data_previous_value) ? JSON.parse(meta_data_previous_value) : meta_data_previous_value;
    if(attribute_type == "customization_attributes" || attribute_type == "standard_measurement_attributes" || attribute_type == "body_measurement_attributes"){
      $scope.style[attribute_type][attribute_name] = attribute_details.value;
      if(meta_data_previous_value && meta_data_previous_value.cost){
        $scope.remove_style_cost(meta_data_previous_value.cost);
      }
      if(attribute_details && attribute_details.cost){
        $scope.add_style_cost(attribute_details.cost);
      }
    }
    else if(attribute_type == "personalization_attributes"){
      if(meta_data_is_checked){
        if(attribute_details && attribute_details.cost){
          $scope.add_style_cost(attribute_details.cost);
        }
        if(!$scope.style[attribute_type][attribute_name]){
          $scope.style[attribute_type][attribute_name] = {};
        }
        $scope.style[attribute_type][attribute_name][attribute_details.value] = {};
      }
      else{
        if(attribute_details && attribute_details.cost){
          $scope.remove_style_cost(attribute_details.cost);
        }
        delete $scope.style[attribute_type][attribute_name][attribute_details.value];
      }
    }
  };

  $scope.save=function(){
    if($scope.newProductType.name == undefined || $scope.newProductType.name == '' || $scope.newProductType.name == 0){
      $scope.alerts.push({type: 'danger', message: 'Name field can\'t be empty !'});
      document.getElementById("name").focus();
    }
    else if($scope.style_image == '' || $scope.style_image == undefined){
      $scope.alerts.push({type: 'danger', message: 'Image field can\'t be empty!'});
      document.getElementById("mandatory_image").focus();
    }
    else{
      $scope.loading= true;
      $scope.newProductType["default_values"] = $scope.style;
      $scope.newProductType["luxire_product_type_id"]=parseInt($scope.selectedProductType);
      $scope.newProductType["additional_cost"] =  $scope.style_cost;
      styleMasterService.createStyleMaster($scope.newProductType).then(function(data){
        styleMasterService.update_image($scope.style_image,data.data.id).then(function(data){
          $scope.loading= false;
          $scope.alerts.push({type: 'success', message: 'Style Master Created Successfully !'});
          $state.go("admin.styleMasterEdit", {id: data.data.id});
        },function(error) {
          console.log(error);
        });
      }, function(info) {
        $scope.loading= false;
        console.log(info);
        $scope.alerts.push({type: 'danger', message: 'Style Master Creation failed !'});
      })
    }
  }

});
