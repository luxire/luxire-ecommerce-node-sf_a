angular.module('luxire')
.controller('ProductAttributesController', function($scope, ProductAttributes, $state){
  $scope.product_attributes = [];
  ProductAttributes.index().then(function(data){
    $scope.product_attributes = data.data.customization_attributes;
    // angular.forEach(data.data, function(val, key){
    //   $scope.product_attributes.concat(val);
    // });
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
      alert('Deleted successful');
    },function(error){
      console.log(error);
      alert('Failed to delete');
    });
  };

  $scope.edit_product_attribute = function(event, product_attribute_id){
    event.preventDefault();
    console.log(product_attribute_id);
    $state.go('admin.product_attributes_edit',{id: product_attribute_id});
  };
})
.controller('AddProductAttributesController',function($scope, ProductAttributes){
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
      alert('key can\'t be empty');
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
      {'key': 'sub_category', 'value': ''}
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
    if(measurement_type['name']){
      ProductAttributes.create(measurement_type)
      .then(function(data){
        console.log(data);
        console.log('created successfuly');
      }, function(error){
        console.log(error);
        console.log('create failed');
      });
    }
    else{
      alert('Name can\'t be blank');
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
.controller('EditProductAttributesController',function($scope, ProductAttributes, $state, $stateParams){
  console.log('stateParams', $stateParams);
  $scope.data = [{
    'key': 'Add Attributes',
    'value': []
  }];
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

  ProductAttributes.show($stateParams.id).then(function(data){
    delete data.data.id;
    object_to_array($scope.data[0]['value'], $scope.data[0]['key'], data.data)
    console.log(data);
  },
   function(error){
     $state.go('admin.product_attributes');
     console.log(error);
   })
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
      alert('key can\'t be empty');
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
    console.log(measurement_type);
    if(measurement_type['name']){
      ProductAttributes.update(measurement_type, $stateParams.id)
      .then(function(data){
        console.log(data);
        console.log('update successful');
      }, function(error){
        console.log(error);
        console.log('update Failed');
      });
    }
    else{
      alert('Name can\'t be blank');
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
