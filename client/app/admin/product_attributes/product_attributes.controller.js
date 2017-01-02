angular.module('luxire')
.controller('ProductAttributesController', function($scope, $rootScope, ProductAttributes, $state, ImageHandler, $timeout, $uibModal){
  $scope.product_attributes = [];

  //Alerts to display the message
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    $scope.alerts.splice(index, 1);
  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }

  /*fetch attributes*/
  $scope.fetch_attributes = function(){
    $scope.loading = true;
    ProductAttributes.index().then(function(data){
      angular.forEach(data.data, function(val, key){
        angular.forEach(val, function(value, key){
          $scope.product_attributes.push(value);
        });
        $scope.loading = false;
      });
    }, function(error){
      console.log(error);
    });
  };
  $scope.fetch_attributes();

  $scope.delete_product_attribute = function(product_attribute, index){
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'delete_attribute.html',
      controller: 'DeleteProductAttributesController',
      size: 'md',
      backdrop: 'static',
      resolve: {
        product_attribute: function () {
          return product_attribute;
        }
      }

    });
    modalInstance.result.then(function (product_attribute) {
      $scope.searchText = "";
      $scope.fetch_attributes();
      $scope.alerts.push({type: 'success', message: 'Deleted attribute '+product_attribute.name+' successfully!'});
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.edit_product_attribute = function(event, product_attribute_id){
    event.preventDefault();
    $state.go('admin.product_attributes_edit',{id: product_attribute_id});
  };
})
.controller('DeleteProductAttributesController', function($scope, $uibModalInstance, product_attribute, ProductAttributes){
  $scope.product_attribute = product_attribute;

  $scope.delete = function () {
    $scope.loading = true;
    ProductAttributes.delete(product_attribute.id).then(function(data){
      $uibModalInstance.close(product_attribute);
      $scope.loading = false;
    }, function(error){
      $scope.loading = false;
      $scope.alerts.push({type: 'danger', message: 'Deletion Failed!'});
      console.error(error);
    });

  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
})
.controller('AddProductAttributesController',function($scope, $state, ProductAttributes, $rootScope, $timeout){
  $scope.remove = function (scope) {
    scope.remove();
  };

  /*Parent attr Image*/
  $scope.upload_prod_attr_image = function(files){
    $scope.prod_attr_image = files;
    if (files && files.length) {
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#parent_image').attr('src', e.target.result);
       }
       reader.readAsDataURL(files[0]);
    }
  };

  $scope.range = {};
  var range_string = "";
  $scope.compute_range = function(range){
    range_string = "";
    range.steps = "";
    for(var i=parseFloat(range.start);i<=parseFloat(range.end);i=parseFloat(i)+parseFloat(range.step)){
      if(i==parseFloat(range.end)){
        range_string = range_string+parseFloat(i).toFixed(2);
      }
      else{
        range_string = range_string+parseFloat(i).toFixed(2)+'#';
      }
    }
    range.steps = range_string;
  };


  /*Image attr image for[custom image that returns url]*/
  $scope.upload_image = function(files){
    if (files && files.length) {
      $scope.loading = true;
      $scope.product_image = files[0];
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#attr_image').attr('src', e.target.result);
       }
       reader.readAsDataURL(files[0]);
       ProductAttributes.add_image(files[0], $scope.image_size)
       .then(function(data){
         $scope.loading = false;
         $scope.image_url = data.data.image;
       }, function(error){
         $scope.loading = false;
         console.error(error);
       });
    }
  }

  $scope.toggle = function (scope) {
    scope.toggle();
  };

  $scope.moveLastToTheBeginning = function () {
    var a = $scope.data.pop();
    $scope.data.splice(0, 0, a);
  };

  $scope.newSubItem = function (scope) {
    var nodeData = scope.$modelValue;
    if(nodeData.key!==''){
      if($scope.checkIsString(nodeData.value)){
        nodeData.value = [];
      }
      nodeData.value.push({
        'key': '',
        'value': ''
      });
    }
    else{
      $scope.alerts.push({type: 'danger', message: 'key can\'t be empty'});
    }

  };

  $scope.collapseAll = function () {
    $scope.$broadcast('angular-ui-tree:collapse-all');
  };

  $scope.expandAll = function () {
    $scope.$broadcast('angular-ui-tree:expand-all');
  };


  $scope.data = [{
    'key': 'Add Attributes',
    'value': [
      {'key':'name', 'value': ''},
      {'key': 'description', 'value': ''},
      {'key': 'value', 'value': ''},
      {'key': 'category', 'value': ''},
      {'key': 'sub_category', 'value': ''},
      {'key': 'help', 'value': ''},
      {'key': 'help_url', 'value': ''}
    ]
  }];

  /*fn to convert array of objects to a single object*/
  var target_object = {};
  var array_to_object = function(parent_object, parent_key, data){
    if(angular.isArray(data)){
      angular.forEach(data, function(value, key){
        if(angular.isArray(value['value'])){
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          parent_object[parent_key][value['key']] = {};
          array_to_object(parent_object[parent_key], value['key'], value['value']);
        }
        else{
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          if(value['value'].indexOf('#')!=-1){
            parent_object[parent_key][value['key']] = value['value'].split('#');
          }
          else{
            parent_object[parent_key][value['key']] = value['value'];
          }
        }
      });
    }
    return target_object;
  };

  $scope.save = function(){
    var measurement_type = array_to_object(target_object, $scope.data[0].key, $scope.data[0].value)['Add Attributes'];
    if(measurement_type['name'] == '' || measurement_type['name'] == undefined){
        $scope.alerts.push({type: 'danger', message: 'Name is a mandatory field!'});
        document.getElementById("mandatory_field").focus();
        return;
    }
    else if(measurement_type['category'] == '' || measurement_type['category'] == undefined ){
      $scope.alerts.push({type: 'danger', message: 'Category is a mandatory field!'});
      document.getElementById("mandatory_field").focus();
      return;
    }
    else if($scope.prod_attr_image == undefined){
      $scope.alerts.push({type: 'danger', message: 'Adding image is mandatory!'});
      document.getElementById("mandatory_field").focus();
      return;
    }
    if(measurement_type['name'] && $scope.prod_attr_image && $scope.prod_attr_image.length){
      $scope.loading = true;
      ProductAttributes.create(measurement_type)
      .then(function(data){
        ProductAttributes.update_image($scope.prod_attr_image[0], data.data.id)
        .then(function(data){
          $scope.loading = false;
          $scope.alerts.push({type: 'success', message: 'Created successfully!'});
          $state.go('admin.product_attributes');
        }, function(error){
          console.error(error);
          $scope.loading = false;
          $scope.alerts.push({type: 'danger', message: 'failed to create!'});
        });
      }, function(error){
        console.log(error);
        $scope.loading = false;
      });
    }
  };

  $scope.checkIsString = function(data){
    if(data.constructor==String){
      return true;
    }
    return false;
  };

  $scope.checkIsObject = function(data){
    if(data.constructor==Object){
      return true;
    }
    return false;
  };
  $scope.checkIsArray = function(data){
    if(data.constructor==Array){
      return true;
    }
    return false;
  };
})
.controller('EditProductAttributesController',function($scope, $rootScope, ProductAttributes, $state, $stateParams, ImageHandler, $timeout){
  $scope.data = [{
    'key': 'Add Attributes',
    'value': []
  }];

  $scope.checkParent = function(node){
    if(node.$modelValue.key === 'image'){
      if(node.$parentNodeScope && node.$parentNodeScope.$modelValue.key === 'Add Attributes'){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return false;
    };
  };

  $scope.range = {};
  var range_string = "";
  $scope.compute_range = function(range){
    range_string = "";
    range.steps = "";
    for(var i=parseFloat(range.start);i<=parseFloat(range.end);i=parseFloat(i)+parseFloat(range.step)){
      if(i==parseFloat(range.end)){
        range_string = range_string+parseFloat(i).toFixed(2);
      }
      else{
        range_string = range_string+parseFloat(i).toFixed(2)+'#';
      }
    }
    range.steps = range_string;
  };
  /*Image*/
  $scope.upload_image = function(files){
    if (files && files.length) {
      $scope.product_image = files[0];
      $scope.loading = true;
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#attr_image').attr('src', e.target.result);
       }
       reader.readAsDataURL(files[0]);
       ProductAttributes.add_image(files[0], $scope.image_size)
       .then(function(data){
         $scope.image_url = data.data.image;
         $scope.loading = false;
       }, function(error){
         console.error(error);
         $scope.loading = false;
       });
    }
  }

  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
  var object_to_array = function(parent_object, parent_key, data){
    if(angular.isObject(data)){
      angular.forEach(data,function(value, key){

        if(angular.isObject(value) && !angular.isArray(value)){
          if(!angular.isArray(parent_object)){
            parent_object = [];
          }
          parent_object.push({'key': key, 'value': []})
          object_to_array(parent_object[parent_object.length-1]['value'], parent_object[parent_object.length-1]['key'], value)
        }
        else{
          if(!angular.isArray(parent_object)){
            parent_object = [];
          }
          else{
            if(angular.isArray(value)){
              parent_object.push({'key': key, 'value': value.toString().replaceAll(',','#')});
            }
            else{
              parent_object.push({'key': key, 'value': value==null?'':value});
            }
          }



        }
      })
    }
    return $scope.data;
  };

  $scope.loading = true;
  ProductAttributes.show($stateParams.id).then(function(data){
    delete data.data.id;
    $('#parent_image').attr('src', ImageHandler.url(data.data.image));
    delete data.data.image;
    object_to_array($scope.data[0]['value'], $scope.data[0]['key'], data.data)
    $scope.loading = false;
  },
   function(error){
     $state.go('admin.product_attributes');
     console.log(error);
   });

   /*Parent attr Image*/
   $scope.upload_prod_attr_image = function(files){
     $scope.prod_attr_image = files;
     if (files && files.length) {
       var reader = new FileReader();
        reader.onload = function (e) {
            $('#parent_image').attr('src', e.target.result);
        }
        reader.readAsDataURL(files[0]);
     }
   };

  $scope.remove = function (scope) {
    scope.remove();
  };

  $scope.toggle = function (scope) {
    scope.toggle();
  };

  $scope.moveLastToTheBeginning = function () {
    var a = $scope.data.pop();
    $scope.data.splice(0, 0, a);
  };

  $scope.newSubItem = function (scope) {
    var nodeData = scope.$modelValue;
    if(nodeData.key!==''){
      if($scope.checkIsString(nodeData.value)){
        nodeData.value = [];
      }
      nodeData.value.push({
        'key': '',
        'value': ''
      });
    }
    else{
      $scope.alerts.push({type: 'danger', message: 'key can\'t be empty'});
    }

  };

  $scope.collapseAll = function () {
    $scope.$broadcast('angular-ui-tree:collapse-all');
  };

  $scope.expandAll = function () {
    $scope.$broadcast('angular-ui-tree:expand-all');
  };

  /*fn to convert array of objects to a single object*/
  var target_object = {};
  var array_to_object = function(parent_object, parent_key, data){
    if(angular.isArray(data)){
      angular.forEach(data, function(value, key){
        if(angular.isArray(value['value'])){
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          parent_object[parent_key][value['key']] = {};
          array_to_object(parent_object[parent_key], value['key'], value['value']);
        }
        else{
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          if(value['value'].indexOf('#')>-1){
            parent_object[parent_key][value['key']] = value['value'].split('#');
          }
          else{
            parent_object[parent_key][value['key']] = value['value'];
          }
        }
      });

    }
    return target_object;
  };

  $scope.save = function(){
    var measurement_type = array_to_object(target_object, $scope.data[0].key, $scope.data[0].value)['Add Attributes'];
    if(measurement_type['name']){
      $scope.loading = true;
      ProductAttributes.update(measurement_type, $stateParams.id)
      .then(function(data){
        if($scope.prod_attr_image && $scope.prod_attr_image.length){
          ProductAttributes.update_image($scope.prod_attr_image[0], data.data.id)
          .then(function(data){
            $scope.loading = false;
            $scope.alerts.push({type: 'success', message: 'Updated successfully'});
            $state.go('admin.product_attributes');
          }, function(error){
            console.error(error);
            $scope.loading = false;
            $scope.alerts.push({type: 'success', message: 'Image upload failed'});
          });
        }
        else{
          $scope.loading = false;
          $scope.alerts.push({type: 'success', message: 'Updated successfully'});
          $state.go('admin.product_attributes');

        }
      }, function(error){
        $scope.loading = false;
        $scope.alerts.push({type: 'danger', message: 'Update failed'});
      });
    }
    else{
      $scope.alerts.push({type: 'danger', message: 'Please fill the mandatory fields'});
    }
  };

  $scope.checkIsString = function(data){
    if(angular.isString(data)){
      return true;
    }
    return false;
  };

  $scope.checkIsObject = function(data){
    if(data.constructor==Object){
      return true;
    }
    return false;
  };
  $scope.checkIsArray = function(data){
    if(data.constructor==Array){
      return true;
    }
    return false;
  };
});
