angular.module('luxire')
.controller('styleMasterEditController',function($scope, $state, $timeout, styleMasterService, $state,$stateParams, ImageHandler, productSearch){
  $scope.newProductType={};
  $scope.allMeasurementType=[];
  $scope.style_cost = {};
  $scope.restricted_params = ["image", "help", "cost"];
   var productTypeId='';
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
  $scope.new_style_detail_image = {
    luxire_style_master_image: {
      category: 'real',
      image: '',
      luxire_style_master_id: $stateParams.id
    }
  };
  $scope.upload_style_detail_image = function(files){
    if (files && files.length) {
      $scope.new_style_detail_image.luxire_style_master_image.image = files[0];
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#style_detail_img').attr('src', e.target.result);
       }
       reader.readAsDataURL(files[0]);
    }
  };
  $scope.submit_style_detail_image = function(){
    $scope.loading = true;
    styleMasterService.upload_new_detail_image($scope.new_style_detail_image.luxire_style_master_image).then(function(data){
      $scope.loading = false;
      delete $scope.new_style_detail_image.luxire_style_master_image.image;
      load_style();
      $('#style_detail_img').attr('src', '');
      $("#newImage").val("");
      $scope.alerts.push({type: 'success', message: 'Image updated successfully !'});
    }, function(error){
      $scope.loading = false;
      $scope.alerts.push({type: 'danger', message: 'Image update failed !'});
    });
  };

  $scope.delete_style_detail_image = function(image){
    var id = image.split('style_master_images/')[1].split('/')[0];
    styleMasterService.delete_detail_image($stateParams.id, id).then(function(data){
      load_style();
      $('#style_detail_img').attr('src', '');
      $("#newImage").val("");
      $scope.alerts.push({type: 'success', message: 'Deleted successfully !'});
    }, function(error){
      $scope.alerts.push({type: 'danger', message: 'Failed to delete !'});
    });
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  /*Image upload*/
  // style master functionality
  $scope.selected_customization_attributes = {}; //Added on 25 aug -Mudassir
  $scope.style = {
    "customization_attributes": {},
    "personalization_attributes": {}
  };

  function load_style(){
    $scope.loading = true;
    styleMasterService.getStyleMasterById($stateParams.id).then(function(data){
      $('#style_master_img').attr('src', ImageHandler.url(data.data.image.split('/small/').join('/original/')));
      $scope.newProductType=data.data;
      delete data.data.image;
      $scope.style = data.data.default_values;
      $scope.selected_customization_attributes = data.data.default_values["customization_attributes"];
      $scope.newProductType["additional_cost"] = data.data["additional_cost"];
      $scope.style_cost = data.data["additional_cost"] || {};
      styleMasterService.getProductTypeById(data.data.luxire_product_type.id).then(function(data) {
        $scope.loading= false;
        $scope.allMeasurementType = data.data.luxire_product_attributes;
        }, function(info){
          $scope.loading= false;
        console.log(info);
      });
    },function(info){
     console.log(info);
     $scope.loading = false; // 29th march
    });
  };
  load_style();

  $scope.checkStyleMasterName = function(name){  // 29th march add this functionality
    if(name == undefined || name == '' || name == 0){
      $scope.emptyNameMsg = true;
      document.getElementById("name").focus();
    }
  };

  $scope.save=function(){
    if($scope.newProductType.name == undefined || $scope.newProductType.name == '' || $scope.newProductType.name == 0){
      $scope.alerts.push({type: 'danger', message: 'Name field can\'t be empty !'});
      document.getElementById("name").focus();
    }
    else{
      $scope.loading= true;
      $scope.newProductType["default_values"] = $scope.style;
      $scope.newProductType["additional_cost"] =  $scope.style_cost;
      styleMasterService.updateStyleMasterById($stateParams.id,$scope.newProductType).then(function(data){
        if($scope.style_image){
          styleMasterService.update_image($scope.style_image,data.data.id).then(function(data){
            $scope.loading= false;
            $scope.alerts.push({type: 'success', message: 'Style updated successfully !'});
            $state.go("admin.styleMasterHome");
          },function(error) {
             console.log(error);
          });
        }
        else{
          $scope.alerts.push({type: 'success', message: 'Style updated successfully !'});
          $scope.loading= false;
          $state.go("admin.styleMasterHome");
        }
      }, function(info) {
         $scope.loading= false;
         $scope.alerts.push({type: 'danger', message: 'Style update failed !'});
         console.log(info);
      })
    }
  }

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
  }
});
