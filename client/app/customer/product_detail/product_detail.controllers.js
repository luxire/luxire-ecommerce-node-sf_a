angular.module('luxire')
.controller('ProductDetailController', function($scope, $sce, CustomerOrders, $state, countries, $stateParams, $rootScope, CustomerProducts, ImageHandler,  $location, $anchorScroll, $uibModal, $window){
  $window.scrollTo(0, 0);


  $scope.weight_index = function(variant_weight){
    // console.log('variant_weight', variant_weight);
    // console.log(parseFloat(variant_weight)-50)
    if((parseFloat(variant_weight)-50)<0){
      return 1;
    }
    else if((parseFloat(variant_weight)-50)>150){
      return 12;
    }
    else{
      return parseInt((parseFloat(variant_weight)-50)/12.5)+1;
    };
  };

  /*Get Thickness icon*/
  $scope.thickness_index = function(variant_thickness){
    if(variant_thickness){
      thickness = parseInt(variant_thickness.split('.')[1].split('mm')[0]);
      if(thickness/10 >5){
        return 6;
      }
      else {
        return Math.ceil(thickness/10);
      }
    }

  };
  /*Get stiffness icon*/
  $scope.stiffness_index = function(variant_stiffness, stiffness_unit){
    if(stiffness_unit=='m'){
      variant_stiffness = parseFloat(variant_stiffness)*100;
    }
    else if(stiffness_unit=='cm'){
      variant_stiffness = parseFloat(variant_stiffness);
    }

    if(variant_stiffness/1.25 >8){
      return 8;
    }
    else{


      return Math.ceil(variant_stiffness/1.25);
    }

  };

  $scope.wash_care = function(variant_wash_care){
    if(variant_wash_care.toLowerCase().indexOf('machine')>-1){
      return 'machine';
    }
    else if(variant_wash_care.toLowerCase().indexOf('hand')>-1){
      return 'hand';
    }
  };

  $scope.get_ounce_weight = function(gram_weight){
    console.log('gram_weight', gram_weight);
    return (parseFloat(gram_weight)/28.3).toFixed(2);
  };



  /*Slider*/

  $scope.value3 = 12;
  $scope.value4 = 20;


  $scope.options_neck_size = {
      from: 12,
      to: 18,
      step: 0.25,
      dimension: "",
      vertical: false,
      scale: [12, '|', 12.5, '|', 13, '|' , 13.5, '|', 14, '|', 14.5, '|',
              15, '|', 15.5, '|', 16, '|' , 16.5, '|', 17, '|', 17.5, '|', 18 ],
      round: 2,
      css: {
          background: {"background-color": "silver"},
          before: {"background-color": "purple"},
          // default: {"background-color": "white"},
          after: {"background-color": "#8A247C"},
          pointer: {"background-color": "red"}
      },
      callback: function(value, elt) {
          $scope.set_attribute_value('standard_measurement_attributes', 'Neck Size', value);
          $scope.get_standard_sizes();
          console.log(value);
      }
  };

  $scope.options_sleeve_length = {
      from: 20,
      to: 33,
      step: 0.5,
      dimension: "",
      vertical: false,
      scale: [20, '|', 21, '|', 22, '|' , 23, '|', 24, '|', 25, '|',
              26, '|', 27, '|', 28, '|' , 29, '|', 30, '|', 31, '|', 32, '|', 33 ],
      round: 1,

      css: {
          background: {"background-color": "silver"},
          before: {"background-color": "purple"},
          // default: {"background-color": "white"},
          after: {"background-color": "#8A247C"},
          pointer: {"background-color": "red"}
      },
      callback: function(value, elt) {
          $scope.set_attribute_value('standard_measurement_attributes', 'Sleeve Length', value);
          $scope.get_standard_sizes();
          console.log(value);
      }
  };


  /**/


  /*fn to convert array of object in a object*/
  $scope.cart_object = {};
  $scope.luxire_styles = [];
  $rootScope.customer_alerts = [];
  $scope.product = {};
  var json_array_to_obj = function(parent, arr){
    $scope[parent] = {};
    $scope.cart_object[parent] = {};
    angular.forEach(arr, function(val, key){
      if(parent !=='personalization_attributes'){
        $scope.cart_object[parent][val.name] = {value: '',options: {}};
      }
      else{
        $scope.cart_object[parent][val.name] = {};
      }
      $scope[parent][val.name] = val.value;
    })
    console.log('after_conv',$scope[parent]);
    return $scope[parent];
  };
  $scope.close_alert = function(index){
    $rootScope.customer_alerts.splice(index);
  };

  $scope.send_sample = function(measurement_sample){
    console.log(measurement_sample);
  };
  $scope.add_to_cart = function(){
    console.log('luxire_cart', $rootScope.luxire_cart);
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items){
      CustomerOrders.add_line_item($rootScope.luxire_cart, $scope.cart_object, $scope.product.master)
      .then(function(data){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          // $state.go('customer.cart');
          $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
        }, function(error){
          console.error(error);
        });
        console.log(data);
      },function(error){
        console.error(error);
      });
    }
    else{
      CustomerOrders.create_order($scope.cart_object, $scope.product.master, $scope.measurement_sample)
      .then(function(data){
        $rootScope.luxire_cart = data.data;
        // $state.go('customer.cart');
        $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
        console.log(data);
      },function(error){
        console.error(error);
      });
    }
  };

  var style_iterator = function(style, attribute_type){
    angular.forEach($scope.cart_object[attribute_type], function(value, key){
      if(angular.isUndefined(style)){
        $scope.cart_object[attribute_type][key]['value'] = '';
      }
      else{
        if(angular.isDefined(style[attribute_type][key])){
          $scope.cart_object[attribute_type][key]['value'] = style[attribute_type][key];
        }
        else{
          $scope.cart_object[attribute_type][key]['value'] = '';
        }
      }
    })
    return;

  };

  $scope.style_extractor = function(style){
    console.log('cart_object',$scope.cart_object);
    console.log('extracted style', style);
    if(angular.isDefined(style)){
      style_iterator(style.default_values, "customization_attributes");
      style_iterator(style.default_values, "standard_measurement_attributes");
      style_iterator(style.default_values, "body_measurement_attributes");


    }
    else{
      style_iterator();
    }
    console.log('cart_object',$scope.cart_object);
    return;
  };

  $scope.revert_style = function(){
    style_iterator();
  };

  CustomerProducts.show($stateParams.product_name).then(function(data){
    console.log(data);
    $scope.product = data.data;
    $scope.images_array = [];
    angular.forEach($scope.product.master.images, function(val, key){
      $scope.images_array.push(val.id)
    })
    json_array_to_obj("customization_attributes", $scope.product.customization_attributes);
    json_array_to_obj("personalization_attributes", $scope.product.personalization_attributes);
    json_array_to_obj("standard_measurement_attributes", $scope.product.standard_measurement_attributes);
    json_array_to_obj("body_measurement_attributes", $scope.product.body_measurement_attributes);
    $scope.luxire_styles = data.data.luxire_style_masters;
    $scope.hideNext= $scope.product.luxire_style_masters.length>6 ? false : true;
    console.log('cart', $scope.cart_object);

  }, function(error){
    console.log(error);
  });

  $scope.choose_style = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'choose_style.html',
      controller: 'ChooseStyleController',
      size: 'md',
      windowClass: 'choose-style-window',
      resolve: {
        luxire_styles: function () {
          return $scope.product.luxire_style_masters;
        }
      }
    });
    modal_instance.result.then(function (selected_style) {
      console.log(selected_style);
      $scope.style_extractor(selected_style);
      $scope.cart_object.selected_style = selected_style;
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.get_standard_sizes = function(){
    console.log($scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"]);
    console.log($scope.cart_object["standard_measurement_attributes"]["Sleeve Length"]["value"]);
    console.log($scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"]);

    if($scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"]
       && $scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"]){
         console.log('making request');
         CustomerProducts.standard_sizes($scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"],
          $scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"],
          $scope.cart_object["standard_measurement_attributes"]["Sleeve Length"]["value"])
         .then(function(data){
           if(data.data && !data.data.msg){
             console.log('std sizes', data);
             $scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"] = data.data['neck'];
             $scope.cart_object["body_measurement_attributes"]["Chest Around"]["value"] = data.data['chest'];
             $scope.cart_object["body_measurement_attributes"]["Waist Around"]["value"] = data.data['waist'];
            //  $scope.cart_object["standard_measurement_attributes"]["Bottom"]["value"] = data.data['bottom'];
            //  $scope.cart_object["standard_measurement_attributes"]["Biceps"]["value"] = data.data['biceps'];
             $scope.cart_object["standard_measurement_attributes"]["Yoke Width"]["value"] = data.data['yoke'];
             $scope.cart_object["body_measurement_attributes"]["Wrist Around"]["value"] = data.data['wrist'];
             $scope.cart_object["standard_measurement_attributes"]["Sleeve Length"]["value"] = data.data['shirt_length'];
           };
         },function(error){
           console.log(error);
         });
   }


  };


  $scope.bespoke_style = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'bespoke_style.html',
      controller: 'BespokeStyleController',
      size: 'lg',
      windowClass: 'bespoke-style-window',
      resolve: {
        product: function () {
          return $scope.product;
        },
        cart_object: function(){
          return $scope.cart_object;
        },
        parent_scope: function(){
          return $scope;
        }
      }
    });
    modal_instance.result.then(function (cart_object) {
      console.log(cart_object);
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.standard_measurement = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'standard_measurements.html',
      controller: 'StandardMeasurementController',
      size: 'lg',
      windowClass: 'bespoke-style-window',
      resolve: {
        product: function () {
          return $scope.product;
        },
        cart_object: function(){
          return $scope.cart_object;
        },
        parent_scope: function(){
          return $scope;
        }
      }
    });
    modal_instance.result.then(function (cart_object) {
      console.log(cart_object);
      $scope.cart_object = cart_object;
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.body_measurement = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'body_measurements.html',
      controller: 'BodyMeasurementController',
      size: 'lg',
      windowClass: 'bespoke-style-window',
      resolve: {
        product: function () {
          return $scope.product;
        },
        cart_object: function(){
          return $scope.cart_object;
        },
        parent_scope: function(){
          return $scope;
        }
      }
    });
    modal_instance.result.then(function (cart_object) {
      console.log(cart_object);
      $scope.cart_object = cart_object;
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });

  };

  console.log($stateParams);
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  }
  var index = -1;
  $scope.activate_slide = function (id){
    index = $scope.images_array.indexOf(id);
    $scope.product.master.images[index].active = true;
  };

  $scope.set_attribute_value = function(attribute_type, attribute_key, attribute_value){
    console.log(attribute_type);
    console.log(attribute_key);
    console.log(attribute_value);
    $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
    $scope.get_standard_sizes();
    console.log($scope.cart_object);
  };


  $scope.make_my_own_style = function(event){
    console.log('scrolling');
    $('html, body').animate({ scrollTop:$("#make_my_own_style").offset().top-120}, 500);
    // $anchorScroll.yOffset = angular.element(document.getElementById('product_detail')).prop('offsetTop')+ 50;
    // console.log('pos',angular.element(document.getElementById('product_detail')).prop('offsetTop'));
    // $location.hash('make_my_own_style');
    // $anchorScroll();
  };

  $scope.move_to_choose_fit = function(){
    $('html, body').animate({ scrollTop:$("#choose_fit").offset().top-120}, 500);
  };

  $scope.move_to_measurements = function(){
    $('html, body').animate({ scrollTop:$("#choose_measurements").offset().top-120}, 500);
  }


  var tempObj=[];
  var slideStart=0;
  var slideEnd=9;
  $scope.hideNext= $scope.product.luxire_style_masters != undefined && $scope.product.luxire_style_masters.length>7 ? false : true;
  $scope.hidePrev=true;
  $scope.slideNext=function(){
    tempObj=$scope.product.luxire_style_masters;
    console.log("slide next is calling");
    slideStart++;
    console.log("slide start: "+slideStart);
    slideEnd++;
    if(slideStart!=0){
      $scope.hidePrev=false;
    }
    console.log("slide end: "+slideEnd);
    $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
    if(slideEnd==$scope.product.luxire_style_masters.length){
      $scope.hideNext=true;
    }

  }
  $scope.slidePrev=function(){

    tempObj=$scope.product.luxire_style_masters;;
    console.log("slide prev is calling");
    slideStart--;
    console.log("slide start: "+slideStart);
    slideEnd--;
    console.log("slide end: "+slideEnd);
    if(slideEnd!=$scope.product.luxire_style_masters.length){
      $scope.hideNext=false;
    }
    $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
    if(slideStart==0){
      $scope.hidePrev=true;
    }

  };
  $scope.active_style_index = -1;
  $scope.select_style=function(index, style){
    console.log("index: "+index);
    console.log('style', style);
    if($scope.active_style_index == index){
      $scope.active_style_index = -1;
      $scope.style_extractor();
      console.log($scope.cart_object);
    }
    else{
      $scope.active_style_index = index;
      $scope.style_extractor(style);
      console.log($scope.cart_object);
    };
  };

  countries.all().then(function(data){
    console.log('countries',data);
    $rootScope.countries = data.data;
  },function(error){
    console.log('error',error);
  });

})
.controller('ChooseStyleController', function($scope, $uibModalInstance, luxire_styles, ImageHandler){
  console.log(luxire_styles);
  $scope.luxire_styles = luxire_styles;
  $scope.selectSliderIndex=-1;
  $scope.selected_style = {};
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  $scope.selectSlider=function(index, selected_style){
    console.log("index: "+index);
    //$(event.target).addClass('selectSlider');
    $scope.selectSliderIndex=index;
    $scope.selected_style = selected_style;
  };

  $scope.done = function(){
    $uibModalInstance.close($scope.selected_style);
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };


})
.controller('BespokeStyleController', function($scope, $uibModalInstance, ImageHandler, product, cart_object, parent_scope, $state, CustomerConstants){
  console.log('parent');
  console.log('product', product);
  console.log('cart', cart_object);
  $scope.product = product;
  $scope.cart_object = cart_object;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.more_details = function(url){
    console.log(url);
    window.open('/#/attributes/', '_blank')
  };

  $scope.upload_custom_image = function(files, index){
    console.log('attr image', files[0]);
    console.log('index', index);
    if (files && files.length) {
      console.log('custom image');
      ImageHandler.custom_image_upload(files[0])
      .then(function(data){
        $scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images'][index].url = data.data.image;
        console.log(data);
      }, function(error){
        console.error(error);
      });
    }
  }

  /*Add custom images*/
  $scope.add_custom_image = function(){
    console.log('add custom images');
    if(!$scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images']
     || ($scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images']
     && !angular.isArray($scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images']))){
       $scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images'] = [];
     }
     $scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images'].push({
       url: '',
       notes: ''
     });
  };

  $scope.delete_custom_image = function(index){
    $scope.cart_object['customization_attributes'][$scope.selected_customization_attribute.name]['options']['custom_images'].splice(index, 1);
  };

  /*Check whether to display in view r not*/
  $scope.check_unpermitted_customization_params = function(attribute, key){
    var unpermitted_params_non_custom = ['image','url','help','help_url', 'help_image'];
    var unpermitted_params_custom = ['help','help_url', 'image'];

    if(attribute.toLowerCase()!='custom'){
      if(unpermitted_params_non_custom.indexOf(key)!=-1){
        console.log('unpermitted_params', key);
        return false;
      }
      else{
        console.log('permitted_params', key);
        return true;
      }
    }
    else{
      if(unpermitted_params_custom.indexOf(key)!=-1){
        console.log('unpermitted_params', key);
        return false;
      }
      else{
        console.log('permitted_params', key);
        return true;
      }
    }
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };



  $scope.selected_customization_attribute_index = 0;
  $scope.selected_customization_style_index = -1;
  $scope.selected_customization_attribute = $scope.product['customization_attributes'][0];
  $scope.activate_customization_attribute = function(customization_attribute, index){
    $scope.selected_customization_attribute_index = index;
    $scope.selected_customization_style_index = -1;
    $scope.selected_customization_attribute = customization_attribute;
    console.log(index);
    console.log($scope.selected_customization_attribute_index);
  };

  $scope.activate_customization_style  = function(style_object, index, style_name){
    console.log('style_object', style_object);
    if($scope.selected_customization_style_index == index){
      $scope.selected_customization_style_index = -1;
      $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['value'] = '';
      $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = {};
      delete $scope["customization_attributes"][$scope.selected_customization_attribute.name];

    }
    else{
      console.log('index not same');
      $scope.selected_customization_style_index = index;
      $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['value'] = style_name;
      if(!angular.isObject($scope["customization_attributes"])){
        $scope["customization_attributes"] = {};
      };
      if(angular.isObject($scope["customization_attributes"]) && !angular.isObject($scope["customization_attributes"][$scope.selected_customization_attribute.name])){
        $scope["customization_attributes"][$scope.selected_customization_attribute.name] = {};
      };
      if(angular.isObject($scope["customization_attributes"]) && angular.isObject($scope["customization_attributes"][$scope.selected_customization_attribute.name]) && !angular.isObject($scope["customization_attributes"][$scope.selected_customization_attribute.name]["options"])){
        $scope["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = {};
      }
      console.log($scope["customization_attributes"]);
      console.log('style_object', style_object);

      angular.forEach(style_object, function(val, key){
        console.log('style_object key', key );
        if($scope.check_unpermitted_customization_params($scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['value'], key)){
          /*Change 15 March 2015 to set default*/
          $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options'][key] = angular.isObject(style_object[key])? style_object[key].default : style_object[key];
          console.log('attr for order_sheet',$scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options']);
        }
      });
      // $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = {};
      $scope["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = style_object;
      // $scope.cart_object["customization_attributes"][$scope.selected_customization_attribute.name]['options'] = style_object;
    }
  };

  $scope.selected_personalization_attribute = $scope.product["personalization_attributes"][0];
  $scope.selected_personalization_attribute_index = 0;
  $scope.activate_personalization_attribute = function(personalization_attribute, index){
    $scope.selected_personalization_attribute_index = index;
    $scope.selected_personalization_attribute = personalization_attribute;
  }

  $scope.cart_object.personalization_cost = '$0.00';
  $scope.add_personalization_cost = function(cost){
    console.log(parseFloat($scope.cart_object.personalization_cost.split('$')[1]));
    console.log(parseFloat(cost.split('$')[1]));
    $scope.cart_object.personalization_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])+parseFloat(cost.split('$')[1])).toFixed(2);
    $scope.total_price();
  };

  $scope.cart_object.total_cost = $scope.product.display_price;
  $scope.total_price = function(){
    $scope.cart_object.total_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])+parseFloat($scope.product.display_price.split('$')[1])).toFixed(2);
  };
  $scope.remove_personalization_cost = function(cost){
    $scope.cart_object.personalization_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])-parseFloat(cost.split('$')[1])).toFixed(2);
    $scope.total_price();
  };
  $scope.add_remove_personalization = function(value, child){
    console.log($scope.selected_personalization_attribute.name);
    console.log('value', value);
    console.log('child', child);
    if(value.selected){
      $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child] = {};
      $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child]['cost'] = value.cost;
      if(value.hasOwnProperty('fabric')){
        $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child]['fabric'] = '';
      }
      console.log('cart object',$scope.cart_object["personalization_attributes"]);
      $scope.add_personalization_cost(value.cost);
      console.log(status);
    }
    else{
      console.log('cart object',$scope.cart_object["personalization_attributes"]);
      console.log(status);
      delete $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child];
      $scope.remove_personalization_cost(value.cost);
    }
  };

  /*Load products*/
  $scope.search_products_url = CustomerConstants.api.products+'?q[name_cont]=';

  $scope.selected_fabric = function(data){
    console.log(data);
  };

  $scope.format_data_for_search = function(data){
    console.log(data);
  };

  $scope.monogram_options = {};
  $scope.add_remove_monogram = function(value){
    console.log(value);
    if(value.selected){
      $scope.monogram_options = $scope.selected_personalization_attribute.value;
      $scope.add_personalization_cost($scope.monogram_options['cost']);
      console.log($scope.monogram_options);
      console.log('cart object',$scope.cart_object["personalization_attributes"]);

    }
    else{
      $scope.remove_personalization_cost($scope.monogram_options.cost);
      $scope.monogram_options = {};
      console.log('cart object',$scope.cart_object["personalization_attributes"]);

    }
  };

  $scope.checkIsArray = function(style_value){
    console.log(style_value);
    console.log('style_value',angular.isArray(style_value));
    if(angular.isArray(style_value)){
      return true;
    }
    else{
      return false;
    }
  };
  $scope.checkIsObject = function(style_value){
    console.log(style_value);
    console.log('style_value',angular.isArray(style_value));
    if(angular.isObject(style_value)){
      return true;
    }
    else{
      return false;
    }
  };
  $scope.luxire_styles = $scope.product.luxire_style_masters;

  console.log('luxire_styles length', $scope.luxire_styles.length);
    var tempObj=[];
    var slideStart=0;
    var slideEnd = 8;
    $scope.hideNext= $scope.product.luxire_style_masters.length>8 ? false : true;
    $scope.hidePrev= slideStart==0? true: false;
    $scope.slideNext=function(){
      tempObj=$scope.product.luxire_style_masters;
      console.log("slide next is calling");
      slideStart++;
      console.log("slide start: "+slideStart);
      slideEnd++;
      if(slideStart!=0){
        $scope.hidePrev=false;
      }
      console.log("slide end: "+slideEnd);
      $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
      if(slideEnd==$scope.product.luxire_style_masters.length){
        $scope.hideNext=true;
      }

    }
    $scope.slidePrev=function(){

      tempObj=$scope.product.luxire_style_masters;;
      console.log("slide prev is calling");
      slideStart--;
      console.log("slide start: "+slideStart);
      slideEnd--;
      console.log("slide end: "+slideEnd);
      if(slideEnd!=$scope.product.luxire_style_masters.length){
        $scope.hideNext=false;
      }
      $scope.luxire_styles = tempObj.slice(slideStart,slideEnd);
      if(slideStart==0){
        $scope.hidePrev=true;
      }

    };
    $scope.active_style_index = -1;
    $scope.select_style=function(index, style){
      console.log("index: "+index);
      if($scope.active_style_index==index){
        $scope.active_style_index = -1;
        parent_scope.style_extractor();
      }
      else{
        $scope.active_style_index = index;
        parent_scope.style_extractor(style);
      }

    };

    $scope.next_step = function(){
      $uibModalInstance.close($scope.cart_object);
    };

})
.controller('StandardMeasurementController', function($scope, $uibModalInstance, ImageHandler, product, cart_object, parent_scope){
  console.log('parent');
  console.log('product', product);
  console.log('cart', cart_object);
  $scope.product = product;
  $scope.cart_object = cart_object;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cart_object.personalization_cost = '$0.00';
  $scope.add_personalization_cost = function(cost){
    console.log(parseFloat($scope.cart_object.personalization_cost.split('$')[1]));
    console.log(parseFloat(cost.split('$')[1]));
    $scope.cart_object.personalization_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])+parseFloat(cost.split('$')[1])).toFixed(2);
    $scope.total_price();
  };

  $scope.cart_object.total_cost = $scope.product.display_price;
  $scope.total_price = function(){
    $scope.cart_object.total_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])+parseFloat($scope.product.display_price.split('$')[1])).toFixed(2);
  };
  $scope.remove_personalization_cost = function(cost){
    $scope.cart_object.personalization_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])-parseFloat(cost.split('$')[1])).toFixed(2);
    $scope.total_price();
  };
  $scope.add_remove_personalization = function(value, child){
    console.log($scope.selected_personalization_attribute.name);
    if(value.selected){
      $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child] = value.cost;
      $scope.add_personalization_cost(value.cost);
      console.log(status);
    }
    else{
      console.log(status);
      delete $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child];
      $scope.remove_personalization_cost(value.cost);
    }
  };


  $scope.checkIsArray = function(style_value){
    console.log(style_value);
    console.log('style_value',angular.isArray(style_value));
    if(angular.isArray(style_value)){
      return true;
    }
    else{
      return false;
    }
  };
    $scope.next_step = function(){
      $uibModalInstance.close($scope.cart_object);
    };


})
.controller('BodyMeasurementController', function($scope, $uibModalInstance, ImageHandler, product, cart_object, parent_scope){
  console.log('parent');
  console.log('product', product);
  console.log('cart', cart_object);
  $scope.product = product;
  $scope.cart_object = cart_object;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };

  $scope.cart_object.personalization_cost = '$0.00';
  $scope.add_personalization_cost = function(cost){
    console.log(parseFloat($scope.cart_object.personalization_cost.split('$')[1]));
    console.log(parseFloat(cost.split('$')[1]));
    $scope.cart_object.personalization_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])+parseFloat(cost.split('$')[1])).toFixed(2);
    $scope.total_price();
  };

  $scope.cart_object.total_cost = $scope.product.display_price;
  $scope.total_price = function(){
    $scope.cart_object.total_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])+parseFloat($scope.product.display_price.split('$')[1])).toFixed(2);
  };
  $scope.remove_personalization_cost = function(cost){
    $scope.cart_object.personalization_cost = '$'+(parseFloat($scope.cart_object.personalization_cost.split('$')[1])-parseFloat(cost.split('$')[1])).toFixed(2);
    $scope.total_price();
  };
  $scope.add_remove_personalization = function(value, child){
    console.log($scope.selected_personalization_attribute.name);
    if(value.selected){
      $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child] = value.cost;
      $scope.add_personalization_cost(value.cost);
      console.log(status);
    }
    else{
      console.log(status);
      delete $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child];
      $scope.remove_personalization_cost(value.cost);
    }
  };


  $scope.checkIsArray = function(style_value){
    console.log(style_value);
    console.log('style_value',angular.isArray(style_value));
    if(angular.isArray(style_value)){
      return true;
    }
    else{
      return false;
    }
  };
    $scope.next_step = function(){
      $uibModalInstance.close($scope.cart_object);
    };


})

.controller('SearchFabricController', function($scope, ImageHandler){
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
})


  // $scope.personalization_item_cost = '';
  // $scope.selected_personalization_attribute_child_index = -1;
  // $scope.activate_personalization_attribute_child = function(child, index, child_value){
  //   console.log('index',index);
  //   console.log('p_index', $scope.selected_personalization_attribute_child_index);
  //   console.log();
  //   if($scope.selected_personalization_attribute_child_index == index){
  //     delete $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute][child];
  //     $scope.personalization_item_cost = '';
  //
  //   }
  //   else{
  //     $scope.cart_object["personalization_attributes"][$scope.selected_personalization_attribute.name][child] = child_value.cost;
  //     $scope.personalization_item_cost = child_value.cost;
  //   }
  //   console.log($scope.cart_object);
  // };
