angular.module('luxire')
.controller('ProductAttributesController', function($scope, $rootScope, ProductAttributes, $state, ImageHandler, $timeout){
  $scope.product_attributes = [];

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

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }
  $scope.loading = true;
  ProductAttributes.index().then(function(data){
    // $scope.product_attributes = data.data.customization_attributes;
    angular.forEach(data.data, function(val, key){
      angular.forEach(val, function(value, key){
        $scope.product_attributes.push(value);
      });
      $scope.loading = false;
    });
    // console.log(data.data);
    // angular.forEach(data.data, function(val,key){
    //   $scope.product_attributes.concat(val);
      // angular.forEach(val, function(value, key){
      //   $scope.product_attributes.push(value);
      // })
      // $scope.product_attributes.concat(val);
      // console.log(val);
      // $scope.product_attributes.push(val);
    // })
    console.log(data);
  }, function(error){
    console.log(error);
  });

  $scope.delete_product_attribute = function(delete_id, index){
    ProductAttributes.delete(delete_id).then(function(data){
      $scope.product_attributes.splice(index,1);
      console.log(data);
      $scope.alerts.push({type: 'success', message: 'Deleted successfuly!'});

    },function(error){
      console.log(error);
      // alert('Failed to delete');
      $scope.alerts.push({type: 'danger', message: 'Deletion Failed!'});

    });
  };

  $scope.edit_product_attribute = function(event, product_attribute_id){
    event.preventDefault();
    console.log(product_attribute_id);
    $state.go('admin.product_attributes_edit',{id: product_attribute_id});
  };
})


.controller('AddProductAttributesController',function($scope, $state, ProductAttributes, $rootScope, $timeout){
  $scope.remove = function (scope) {
    scope.remove();
  };

  /*Parent attr Image*/
  $scope.upload_prod_attr_image = function(files){
    console.log('prod attr image', files[0]);
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
    console.log('range', range)
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
    console.log('attr image', files[0]);
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
         console.log(data);
       }, function(error){
         $scope.loading = false;
         console.error(error);
       });
      console.log('files to upload',files[0]);
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
      // alert('key can\'t be empty');
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


      // [{
      //   'key': '',
      //   'value': ''
      // }]},
    ]
  }];

  /*fn to convert array of objects to a single object*/
  var target_object = {};
  var array_to_object = function(parent_object, parent_key, data){
    console.log('parent_object', parent_object);
    console.log('parent_key', parent_key);
    console.log('data', data);

    if(angular.isArray(data)){
      // console.log('value is an array');
      angular.forEach(data, function(value, key){
        // console.log('iterating key', key);
        // console.log('iterating value', value);
        if(angular.isArray(value['value'])){
          // console.log('child value is an array');
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          parent_object[parent_key][value['key']] = {};
          array_to_object(parent_object[parent_key], value['key'], value['value']);
        }
        else{
          // console.log('child value is not an array');
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          if(value['value'].indexOf('#')!=-1){
            parent_object[parent_key][value['key']] = value['value'].split('#');
          }
          else{
            parent_object[parent_key][value['key']] = value['value'];
          }
          // console.log('child object', parent_object);
        }
      });

    }
    return target_object;
  };

  $scope.save = function(){
    console.log(array_to_object(target_object, $scope.data[0].key, $scope.data[0].value));
    var measurement_type = array_to_object(target_object, $scope.data[0].key, $scope.data[0].value)['Add Attributes'];
    if(measurement_type['name'] && $scope.prod_attr_image && $scope.prod_attr_image.length){
      $scope.loading = true;
      ProductAttributes.create(measurement_type)
      .then(function(data){

        console.log('data after create', data);
        ProductAttributes.update_image($scope.prod_attr_image[0], data.data.id)
        .then(function(data){
          $scope.loading = false;
          console.log(data);
          $scope.alerts.push({type: 'success', message: 'created successfuly!'});
          $timeout(function(){
            $state.go('admin.product_attributes');
          }, 3000)
          // $state.go('admin.product_attributes');
          // alert('created successfuly');
        }, function(error){
          console.error(error);
          $scope.loading = false;
          $scope.alerts.push({type: 'danger', message: 'failed to create!'});

        });
        console.log(data);
        console.log('created successfuly');
      }, function(error){
        console.log(error);
        $scope.loading = false;
        console.log('create failed');
      });
    }
    else{
      if(measurement_type['name'] == '' || measurement_type['name'] == undefined){
        $scope.alerts.push({type: 'danger', message: 'Name is mandatory field!'});
        document.getElementById("mandatory_field").focus();
        return;
    }
    else if(measurement_type['category'] == '' || measurement_type['category'] == undefined ){
      $scope.alerts.push({type: 'danger', message: 'Category is mandatory field!'});
      document.getElementById("mandatory_field").focus();
      return;
    }
    else if($scope.prod_attr_image == undefined){
      $scope.alerts.push({type: 'danger', message: 'image is mandatory field!'});
      document.getElementById("mandatory_field").focus();
      return;
    }
      // $scope.alerts.push({type: 'danger', message: 'Fill mandatory fields!'});
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
  console.log('stateParams', $stateParams);
  $scope.data = [{
    'key': 'Add Attributes',
    'value': []
  }];

  $scope.checkParent = function(node){
    if(node.$modelValue.key === 'image'){
      console.log(node.$modelValue.key +'  '+ node.$parentNodeScope.$modelValue.key);
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
    console.log('range', range)
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
    console.log('attr image', files[0]);
    if (files && files.length) {
      $scope.product_image = files[0];
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#attr_image').attr('src', e.target.result);
       }
       reader.readAsDataURL(files[0]);
       ProductAttributes.add_image(files[0], $scope.image_size)
       .then(function(data){
         $scope.image_url = data.data.image;
         console.log(data);
       }, function(error){
         console.error(error);
       });
      console.log('files to upload',files[0]);
    }
  }

  // $scope.upload_measurement_type_image = function(files){
  //   if (files && files.length) {
  //     $scope.measurement_attribute_image = files[0];
  //     var reader = new FileReader();
  //      reader.onload = function (e) {
  //          $('#attr_image').attr('src', e.target.result);
  //      }
  //      reader.readAsDataURL(files[0]);
  //   }
  // };

  String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
  var object_to_array = function(parent_object, parent_key, data){
    if(angular.isObject(data)){
      angular.forEach(data,function(value, key){

        if(angular.isObject(value) && !angular.isArray(value)){
          console.log('value',value);
          console.log('val cons',value.constructor);
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
    console.log(data);
  },
   function(error){
     $state.go('admin.product_attributes');
     console.log(error);
   });




   /*Parent attr Image*/
   $scope.upload_prod_attr_image = function(files){
     console.log('prod attr image', files[0]);
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
      // alert('key can\'t be empty');
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
    console.log('parent_object', parent_object);
    console.log('parent_key', parent_key);
    console.log('data', data);

    if(angular.isArray(data)){
      // console.log('value is an array');
      angular.forEach(data, function(value, key){
        // console.log('iterating key', key);
        // console.log('iterating value', value);
        if(angular.isArray(value['value'])){
          // console.log('child value is an array');
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }
          parent_object[parent_key][value['key']] = {};
          array_to_object(parent_object[parent_key], value['key'], value['value']);
        }
        else{
          // console.log('child value is not an array');
          if(!angular.isObject(parent_object[parent_key])){
            parent_object[parent_key] = {};
          }

          if(value['value'].indexOf('#')>-1){
            parent_object[parent_key][value['key']] = value['value'].split('#');
          }
          else{
            parent_object[parent_key][value['key']] = value['value'];
          }
          // console.log('child object', parent_object);
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
        console.log('data after create', data);
        if($scope.prod_attr_image && $scope.prod_attr_image.length){
          ProductAttributes.update_image($scope.prod_attr_image[0], data.data.id)
          .then(function(data){
            $scope.loading = false;
            console.log(data);
            // alert('Updated successfuly');

          }, function(error){
            console.error(error);
            $scope.loading = false;
            // alert('Update failed');


          });

        }
        console.log(data);
        console.log('updated successfuly');
        $scope.alerts.push({type: 'success', message: 'updated successfully'});
        $timeout(function(){
          $state.go('admin.product_attributes');
        }, 3000)


      }, function(error){
        console.log(error);
        $scope.loading = false;
        console.log('update failed');
        $scope.alerts.push({type: 'danger', message: 'update failed'});

      });
    }
    else{
      // alert('Fill mandatory fields');
      $scope.alerts.push({type: 'danger', message: 'Fill mandatory fields'});

    }



    // var measurement_type = array_to_object(target_object, $scope.data[0].key, $scope.data[0].value)['Add Attributes'];
    // console.log(measurement_type);
    // if(measurement_type['name']){
    //   ProductAttributes.update(measurement_type, $stateParams.id)
    //   .then(function(data){
    //     console.log(data);
    //     console.log('update successful');
    //   }, function(error){
    //     console.log(error);
    //     console.log('update Failed');
    //   });
    // }
    // else{
    //   alert('Name can\'t be blank');
    // }
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

// angular.module('luxire')
// .controller('ProductAttributesController',function($scope){
//   $scope.remove = function (scope) {
//     scope.remove();
//   };
//
//   $scope.toggle = function (scope) {
//     scope.toggle();
//   };
//
//   $scope.moveLastToTheBeginning = function () {
//     var a = $scope.data.pop();
//     $scope.data.splice(0, 0, a);
//   };
//
//   $scope.newSubItem = function (scope, key_index) {
//     console.log('scope', scope);
//     console.log('index', key_index);
//     console.log(key_index.split('#'));
//     var split_key_index = key_index.split('#');
//     if(split_key_index.length > 0){
//       switch (split_key_index.length) {
//         case 1: if(angular.isObject($scope.data[split_key_index[0]])){
//                   $scope.data[split_key_index[0]][''] = '';
//                 }
//                 else{
//                   $scope.data[split_key_index[0]] = {'': ''};
//                 }
//                 break;
//         case 2: if(angular.isObject($scope.data[split_key_index[0]][split_key_index[1]])){
//                   $scope.data[split_key_index[0]][split_key_index[1]][''] = '';
//                 }
//                 else{
//                   $scope.data[split_key_index[0]][split_key_index[1]] = {'': ''};
//                 }
//                 break;
//         case 3: if(angular.isObject($scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]])){
//                   $scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][''] = '';
//                 }
//                 else{
//                   $scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]] = {'': ''};
//                 }
//                 break;
//         case 4: if(angular.isObject($scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][split_key_index[3]])){
//                   $scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][split_key_index[3]] = '';
//                 }
//                 else{
//                   $scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][split_key_index[3]] = {'': ''};
//                 }
//                 break;
//         case 5: if(angular.isObject($scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][split_key_index[3]][split_key_index[4]])){
//                   $scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][split_key_index[3]][split_key_index[4]][''] = '';
//                 }
//                 else{
//                   $scope.data[split_key_index[0]][split_key_index[1]][split_key_index[2]][split_key_index[3]][split_key_index[4]] = {'': ''};
//                 }
//                 break;
//
//       }
//     }
//     // var target_object = {};
//     // angular.forEach(split_key_index, function(value,key){
//     //   if(target_object=={}){
//     //     target_object = $scope.data[value];
//     //   }
//     //   else{
//     //     target_object = target_object[value];
//     //   }
//     //
//     // })
//     // var nodeData = scope.$modelValue;
//     // if(nodeData.key!==''){
//     //   if($scope.checkIsString(nodeData.value)){
//     //     nodeData.value = [];
//     //   }
//     //   nodeData.value.push({
//     //     'key': '',
//     //     'value': ''
//     //   });
//     // }
//     // else{
//     //   alert('key can\'t be empty');
//     // }
//
//   };
//
//   $scope.collapseAll = function () {
//     $scope.$broadcast('angular-ui-tree:collapse-all');
//   };
//
//   $scope.expandAll = function () {
//     $scope.$broadcast('angular-ui-tree:expand-all');
//   };
//
//
//   $scope.data = {
//     'Add attributes': {
//       'name': '',
//       'description': '',
//       'value': {
//         'name': '',
//         'title': ''
//       }
//     }
//   };
//
//   /*fn to convert array of objects to a single object*/
//
//   var array_to_object = function(parent_object,data){
//     console.log('parent_object',parent_object);
//     console.log('data', data);
//     if($scope.checkIsArray(data['value'])){
//       console.log(data['value'], 'is an array');
//       console.log(data['key'], 'is the key');
//       parent_object[data['key']] = {};
//       console.log('Modified parent_object', parent_object);
//       // angular.forEach(data['value'], function(val,key){
//       //   array_to_object(parent_object[data['key']], val);
//       // });
//     }
//     else{
//       parent_object[data['key']] = data['value'];
//     }
//     // return parent_object;
//   };
//
//   $scope.save = function(){
//     var attribute_object = {};
//     console.log($scope.data[0].value);
//     console.log(array_to_object(attribute_object, $scope.data[0]));
//   };
//
//   $scope.checkIsString = function(data){
//     if(data.constructor==String){
//       return true;
//     }
//     return false;
//   };
//
//   $scope.checkIsObject = function(data){
//     if(data.constructor==Object){
//       return true;
//     }
//     return false;
//   };
//   $scope.checkIsArray = function(data){
//     if(data.constructor==Array){
//       return true;
//     }
//     return false;
//   };
// });
// else{
//
// }
// console.log('parent_object',parent_object);
// console.log('data', data);
// if($scope.checkIsArray(data['value'])){
//   console.log(data['value'], 'is an array');
//   console.log(data['key'], 'is the key');
//   parent_object[data['key']] = {};
//   console.log('Modified parent_object', parent_object);
//   // angular.forEach(data['value'], function(val,key){
//   //   array_to_object(parent_object[data['key']], val);
//   // });
// }
// else{
//   parent_object[data['key']] = data['value'];
// }
// return parent_object;
