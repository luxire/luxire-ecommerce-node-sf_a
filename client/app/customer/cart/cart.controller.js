angular.module('luxire')
.controller('CustomerCartController',function($scope, $state, $sce, ImageHandler, $rootScope, $stateParams, CustomerOrders, orders, CustomerConstants, $window){
  window.scrollTo(0, 0);
  $scope.loading_cart = true;
  function update_state(order){
    if(order.state!="cart"){
      CustomerOrders.update(order, {
        state: "cart"
      })
      .then(function(data){
        console.log('updated cart state to ', data.data.state);
      }, function(error){
        console.log('update cart failed', error);
      });
    }
  };
  if($rootScope.luxire_cart && $rootScope.luxire_cart.hasOwnProperty('number') && $rootScope.luxire_cart.hasOwnProperty('token')){
    $scope.loading_cart = false;
    update_state($rootScope.luxire_cart);
  }
  else if($rootScope.luxire_cart && Object.keys($rootScope.luxire_cart).length === 0){
    $scope.loading_cart = false;
  }
  else{
    $scope.$on('fetched_order_from_cookie', function(event, data){
      $scope.loading_cart = false;
      console.log('successful fetch',data);
      update_state(data.data);
    });
  }
  console.log('CartController params', $stateParams);

  $scope.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'line_item_detail.html',
    title: ''
  };

  /*Order json*/
  console.log('cart', $rootScope.luxire_cart);

  $scope.go_to_product_listing = function(){
    $state.go('customer.home');
  };

  var html_text = '';
  var personalized_text = '';
  var customized_text = '';
  var measurement_std_text = '';
  var measurement_body_text = '';

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.object_keys_length = function(obj){
    return Object.keys(obj).length;
  };


  /*order json*/


  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  function getOrder(success_msg, danger_msg){
    CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
      $rootScope.luxire_cart = data.data;
      console.log('fetched order', data.data);
      $rootScope.alerts.push({type: 'success', message: success_msg});
    }, function(error){
      $rootScope.alerts.push({type: 'danger', message: danger_msg});
      console.error(error);
    });

  }

  var updated_line_items = [];
  $scope.update_cart = function(line_item, quantity){
    console.log('update cart', line_item);
    console.log('quantity', quantity);
    if(quantity>0){
      CustomerOrders.update_line_item($rootScope.luxire_cart, line_item.id, line_item.variant_id, quantity)
      .then(function(data){
        console.log(data.data);
        getOrder('Cart updated successfully', 'Failed to update cart');
      }, function(error){
        if(quantity==0&&error.status==404){
          getOrder('Line item deleted successfully', 'Failed to update cart');
        }
        console.error(error);
      });
    }



  };


  $scope.delete_line_item = function(line_item_id, index){
    CustomerOrders.delete_line_item($rootScope.luxire_cart, line_item_id)
    .then(function(data){
      console.log(data);
      $rootScope.luxire_cart.line_items.splice(index, 1);
      getOrder('Line item deleted successfully', 'Failed to delete line item');
    }, function(error){
      console.error(error);
    });


  };

  $scope.empty_cart = function(){
    CustomerOrders.empty_cart($rootScope.luxire_cart)
    .then(function(data){
      console.log(data);
      $rootScope.alerts.push({type: 'success', message: 'Line items deleted successfully'});
    }, function(error){
      $rootScope.alerts.push({type: 'danger', message: 'Failed to delete line items'});
    });
    CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
      $rootScope.luxire_cart = data.data;
      $rootScope.alerts.push({type: 'success', message: 'Line item deleted successfully'});
    }, function(error){
      $rootScope.alerts.push({type: 'danger', message: 'Failed to delete line item'});
      console.error(error);
    });

  };

  $scope.checkout = function(){
    console.log('proceed_to_checkout');
    console.log($rootScope.luxire_cart);
    CustomerOrders.proceed_to_checkout($rootScope.luxire_cart)
    .then(function(data){
      $rootScope.luxire_cart = data.data;
      $state.go('customer.checkout_address');
      console.log(data);
    }, function(error){
      console.error(error);
    })
  };

})

// $scope.update_cart = function(line_items){
//   console.log(line_items);
//   angular.forEach(line_items, function(val, key){
//     CustomerOrders.update_line_item($rootScope.luxire_cart, val.id, val.variant_id, val.quantity)
//     .then(function(data){
//       console.log(data.data);
//     }, function(error){
//       console.error(error);
//     })
//   });
//   CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
//     $rootScope.luxire_cart = data.data;
//     $rootScope.alerts.push({type: 'success', message: 'Cart updated successfully'});
//   }, function(error){
//     $rootScope.alerts.push({type: 'danger', message: 'Failed to update cart'});
//     console.error(error);
//   });
// };

// function customization_template(customization_data){
//   customized_text = '<div class="row" style="margin-left: 0px; margin-right: 0px; background: #F8F8F8">'
//                       +'<div class="col col-md-8 col-sm-8 col-lg-8" style="padding-right: 0px; font-family: Arial; font-weight:600;font-size: 90%;">'
//                         +'<h5>Selected Options</h5>'
//                       +'</div>'
//                     +'</div>'
//                     +'<div class="row" style="background: #F8F8F8; padding-left: 5%">'
//
//
//   angular.forEach(customization_data, function(val, key){
//     if(val.value){
//       customized_text = customized_text+'<p style="font-size: 90%; margin-bottom: 0px">'+key+': '+val.value+'</p>'
//     }
//   });
//   return customized_text+'</div>';
// };
//
//
// function personalization_template(personalization_data){
//   personalized_text = '<div class="row" style="background: #F8F8F8; padding-left: 5%">'
//   angular.forEach(personalization_data, function(val, key){
//
//     if(Object.keys(val).length!==0){
//       console.log('personalization has value', val);
//       console.log('personalization has key', Object.keys(val).length==0);
//
//       personalized_text = personalized_text +'<h5>'+key+'<h5>'
//       if(key.toLowerCase()=='monogram'){
//         angular.forEach(val, function(monogram_value, monogram_key ){
//           personalized_text = personalized_text+'&nbsp;&nbsp;<p style="font-size: 90%; margin-bottom: 0px">'+monogram_key+':'+monogram_value+'</p>'
//         })
//       }
//       else {
//         angular.forEach(val, function(v, k ){
//           if(v.hasOwnProperty('fabric')){
//             personalized_text = personalized_text+'&nbsp;&nbsp;<p style="font-size: 90%; margin-bottom: 0px">'+k+':'+v.fabric+'</p>'
//           }
//           else{
//             personalized_text = personalized_text+'&nbsp;&nbsp;<p style="font-size: 90%; margin-bottom: 0px">'+k+'</p>'
//           }
//         })
//       }
//
//     }
//
//   })
//   return personalized_text+'</div>';
// };
//
// // function measurement_std_template(standard_measurements){
// //   measurement_std_text = '<div class="row" style="background: #F0F0F0; padding-left: 5%">'
// //                             +'<h5>Custom Measurements</h5>'
// //                           +'</div>'
// //                           +'<div class="row" style="padding-left: 5%">'
// //   angular.forEach(standard_measurements, function(val, key){
// //     console.log('key', key);
// //     console.log('value', val);
// //
// //     if(val.value){
// //       measurement_std_text = measurement_std_text+'<p style="font-size: 90%; margin-bottom: 0px">'+key+': '+val.value+'</p>'
// //     }
// //   });
// //   return measurement_std_text+'</div>';
// //
// // };
// function measurement_std_template(standard_measurements){
//   measurement_std_text = '<div class="row" style="background: #F0F0F0; padding-left: 3.5%">'
//                             +'<h5>Custom Measurements</h5>'
//                           +'</div>'
//                           +'<div class="measurement row" style="padding-left: 5%">'
//   angular.forEach(standard_measurements, function(val, key){
//     console.log('key', key);
//     console.log('value', val);
//
//     if(val.value){
//       measurement_std_text = measurement_std_text+'<tr><td>'+key+': </td>&nbsp;<td>'+val.value+'</td></tr><br>'
//     }
//   });
//   return measurement_std_text+'</div>';
//
// };
//
// function measurement_body_template(body_measurements){
//   measurement_body_text = '<div class="row" style="background: #F0F0F0; padding-left: 3.5%">'
//                             +'<h5>Body Measurements</h5>'
//                           +'</div>'
//                           +'<div class="row" style="padding-left: 3.5%">'
//   angular.forEach(body_measurements, function(val, key){
//     if(val.value){
//       measurement_body_text = measurement_body_text+'<p style="font-size: 90%; margin-bottom: 0px">'+key+': '+val.value+'</p>'
//     }
//   });
//   return measurement_body_text+'</div>';
//
// };
//
//
// $scope.trigger_popover = function(line_item){
//   console.log('line_item_attr', line_item);
//   personalized_text = '';
//   customized_text = '';
//   measurement_std_text = '';
//   measurement_body_text = '';
//
//   console.log(line_item);
//   html_text = '<div class="row" style="text-align: right; font-size: 150%; margin-top: -4%; margin-right: -3%;cursor:pointer" click="">'
//               +'X</div>'
//               +'<div class="row" style="">'
//                   +'<div class="row" style="margin-left: 0px; margin-right: 0px; margin: 3%">'
//                     +'<div class="col col-md-4 col-sm-4 col-lg-4">'
//                       +'<div class="row">'
//                           +'<img style="max-width: 100%; border: solid 1px #888282" src='+$scope.getImage(line_item.variant.images[0].product_url)+'>'
//                       +'</div>'
//                     +'</div>'
//                     +'<div class="col col-md-8 col-sm-8 col-lg-8" style="padding-right: 0px; font-family: Arial; font-weight:600;font-size: 90%; margin-top: 5%">'
//                       +'<p>'+line_item.variant.name+'</p>'
//                       +'<p style="font-size: 150%; margin-top: 5%">'+line_item.display_amount+'</p>'
//                     +'</div>'
//
//                   +'</div>'
//                 +'</div>';
//   if(line_item.luxire_line_item && line_item.luxire_line_item.customized_data){
//     html_text = html_text+customization_template(line_item.luxire_line_item.customized_data);
//   }
//   if(line_item.luxire_line_item && line_item.luxire_line_item.personalize_data){
//     html_text = html_text+personalization_template(line_item.luxire_line_item.personalize_data);
//   }
//   if(line_item.luxire_line_item && line_item.luxire_line_item.measurement_data && line_item.luxire_line_item.measurement_data.standard_measurement_attributes){
//     html_text = html_text+measurement_std_template(line_item.luxire_line_item.measurement_data.standard_measurement_attributes);
//   }
//   if(line_item.luxire_line_item && line_item.luxire_line_item.measurement_data && line_item.luxire_line_item.measurement_data.body_measurement_attributes){
//     html_text = html_text+measurement_body_template(line_item.luxire_line_item.measurement_data.body_measurement_attributes);
//   }
//   $scope.popover_html = $sce.trustAsHtml(html_text);
// };
