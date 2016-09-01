angular.module('luxire')
.controller('ProductDetailController', function($scope, $sce, CustomerOrders, $state, countries, $stateParams, $rootScope, CustomerProducts, ImageHandler,  $location, $anchorScroll, $uibModal, $window, $timeout, $log, $compile, $interval, CustomerUtils){
  $window.scrollTo(0, 0);
  $scope.loading_product = true;
  $scope.display_summary = false;
  $scope.is_bespoke_style = false;
  $scope.active_product_description_image = {
    product_url: '',
    large_url: '',
    original_url: ''
  };

  var convert_to_cm = function(product){
    CustomerUtils.convert_in_to_cm(product['customization_attributes']);
    CustomerUtils.convert_in_to_cm(product['personalization_attributes']);
    console.log('after conversion product', product);
    $scope.product_in_cm = product;
    /*Standard measurement in cm */
    // $scope.standard_measurement_attributes_in_cm = angular.copy($scope.standard_measurement_attributes);
    // conv_iterator($scope.standard_measurement_attributes_in_cm);
  };

  CustomerProducts.show($stateParams.product_name).then(function(data){
    console.log('product data for', $stateParams.product_name, data);
    $scope.product = data.data;
    $scope.images_array = [];
    $scope.images_array_for_zoom = {};
    angular.forEach($scope.product.master.images, function(val, key){
      $scope.images_array.push(val.id)
      $scope.images_array_for_zoom[key+1] = {
        img: $scope.getImage(val.large_url),
        thumb: $scope.getImage(val.mini_url),
        title: key+'image'
      }
    })
    $scope.active_product_description_image = $scope.product.master.images[0];
    json_array_to_obj("customization_attributes", $scope.product.customization_attributes);
    json_array_to_obj("personalization_attributes", $scope.product.personalization_attributes);
    json_array_to_obj("standard_measurement_attributes", $scope.product.standard_measurement_attributes);
    json_array_to_obj("body_measurement_attributes", $scope.product.body_measurement_attributes);
    $scope.luxire_styles = data.data.luxire_style_masters;
    console.log('cart', $scope.cart_object);
    $scope.cart_object_prototype = angular.copy($scope.cart_object);
    $scope.active_product_type = $scope.product.product_type.product_type;
    $scope.fabric_product_types = ["shirts", "pants", "jackets"];
    $scope.is_fabric_product = $scope.fabric_product_types.indexOf($scope.active_product_type.toLowerCase()) >-1 ? true : false;
    console.log('product_type', $scope.active_product_type, 'is fabric product', $scope.is_fabric_product);
    $scope.loading_product = false;
    if($scope.product.product_type.product_type.toLowerCase() === 'gift cards'){
      $scope.selected_gift_card_variant = $scope.product.master;
      $scope.product.variants.push($scope.product.master);
      console.log('selected gift card variant', $scope.selected_gift_card_variant);
    }

    /*Convert to cm */
      convert_to_cm(angular.copy(data.data));
    /* */

    // $scope.hideNext= $scope.product.luxire_style_masters.length>5 ? false : true;
    // if($scope.fabric_product_types.indexOf($scope.product.product_type.product_type.toLowerCase())!==-1){
    //   load_measurement_scales($scope.product);
    // }
  }, function(error){
    $scope.loading_product = false;
    console.log(error);
  });

  $scope.select_gift_card_variant = function(variant){
    console.log('gift card variant', variant);
    $scope.selected_gift_card_variant = variant;
  };

  /*Unit conversion*/
  $scope.selected_measurement_unit = "in";
  $scope.$on('measurement_unit_change', function(event, data){
    console.log('unit', data.symbol.toLowerCase());
    $scope.selected_measurement_unit = data.symbol.toLowerCase();
    $scope.selected_measurement_unit === "cm" ? CustomerUtils.convert_in_to_cm($scope.cart_object) : CustomerUtils.convert_cm_to_in($scope.cart_object);
  });

  /*Multi currency support*/
  $scope.selected_currency = CustomerUtils.get_local_currency_in_app();
  $scope.$on('currency_change', function(event, data){
    console.log('currency changed', data)
    $scope.selected_currency = data;
  });


  /*Get weight icon*/
  var weight_indexes_ref = {
    shirts: {
      min: 50,
      max: 150,
      step: 12.5//150/12
    },
    pants: {
      min: 150,
      max: 500,
      step: 30 //
    }
  };
  var min_weight = 0;
  var max_weight = 0;
  $scope.weight_index = function(variant_weight, product_type){
    product_type = product_type.toLowerCase();
    if(product_type && product_type.indexOf('pant') !== -1){
      min_weight = weight_indexes_ref['pants']['min'];
      max_weight = weight_indexes_ref['pants']['max'];
      step = weight_indexes_ref['pants']['step'];
    }
    else if(product_type && product_type.indexOf('pant') == -1){
      min_weight = weight_indexes_ref['shirts']['min'];
      max_weight = weight_indexes_ref['shirts']['max'];
      step = weight_indexes_ref['shirts']['step'];
    };


    if((parseFloat(variant_weight))<min_weight){
      return 1;
    }
    else if((parseFloat(variant_weight))>max_weight){
      return 12;
    }
    else{
      return parseInt((parseFloat(variant_weight)-min_weight)/step)+1;
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
    return (parseFloat(gram_weight)/28.3).toFixed(2);
  };

  /*Slider*/

  $scope.value3 = 12;
  $scope.value4 = 20;
  $scope.reg_enlarged_image = function(element){
    console.log('show enlarged image for', element.target.id);
    $('#product_description_image_id').ezPlus({
      gallery: 'thumbnail-part',
      galleryActiveClass: 'active-thumbnail',
      easing: true,
      zoomWindowFadeIn: 300,
      zoomWindowFadeOut: 300,
      lensFadeIn: 300,
      lensFadeOut: 300,
      responsive: true,
      borderSize: 1,
      cursor: "crosshair",
      zoomType: "window",
      zoomWindowWidth: 800,
      zoomWindowHeight: 450,
      zoomWindowOffsetX: 80,
      zoomWindowOffsetY: -5,
      zoomWindowPosition: 1,
      loadingIcon: '/client/assets/images/customer/loading.gif'

    });

    $('#product_description_image_id').bind('click', function (e) {
      console.log('clicked',e);
      var ez = $('#product_description_image_id').data('ezPlus');
      $.fancyboxPlus(ez.getGalleryList());
      return false;
    });

        // var modal_instance = $uibModal.open({
    //   animation: true,
    //   templateUrl: 'enlarged_product_image.html',
    //   controller: 'EnlargedProductImageController',
    //   size: 'md',
    //   windowClass: 'enlarged-product-window',
    //   resolve: {
    //     product: function () {
    //       return $scope.product;
    //     }
    //   }
    // });
    // modal_instance.result.then(function () {
    //
    // }, function () {
    //   console.info('Modal dismissed at: ' + new Date());
    // });

  };
  $scope.dereg_enlarged_image = function(element){
  };


  /*Measurement Slider*/

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
        if(val.name.toLowerCase().indexOf('fit type')!==-1){// neutralize fit type for shirt/pant/jacket eg, replacing shirts fit type with Fit type
          val.name = 'Fit Type';
        }
        if(angular.isObject(val.value)){
          $scope.cart_object[parent][val.name] = {value: '',options: {}};
        }
        else{
          $scope.cart_object[parent][val.name] = {value: val.value,options: {}};
        }

      }
      // else{
      //   $scope.cart_object[parent][val.name] = {};
      // }
      $scope[parent][val.name] = val.value;
    })
    // console.log('after_conv',parent , $scope[parent]);
    // console.log('after_conv cart',$scope['cart_object'][parent]);

    return $scope[parent];
  };
  $scope.close_alert = function(index){
    $rootScope.customer_alerts.splice(index);
  };

  $scope.send_sample = function(measurement_sample){
    console.log(measurement_sample);
  };

  $scope.invalid_fields = [];

  /*Validations*/
  var has_valid_measurements = function(){
    var mandatory_fields = [];
    var valid_measurements = [];
    $scope.invalid_fields = [];
    var product_type_validations = {
      'shirts': '',//Collar Size,Sleeve Length,Fit Type
      'pants': '',//Waist Size,In-seam,Fit Type
      'jackets': '',//Chest Size,Length,Fit Type
      'gift cards': '',
      'ties': '',//Tie Width,Tie Length
      'belts': ''//Belt Length
    };
    var product_type = $scope.product.product_type.product_type;
    console.log('product_type', product_type_validations[product_type.toLowerCase()].indexOf(','));
    if(product_type_validations[product_type.toLowerCase()].indexOf(',')!==-1){
      mandatory_fields = product_type_validations[product_type.toLowerCase()].split(',');
      console.log('mandatory_fields', mandatory_fields);
      angular.forEach(mandatory_fields, function(val, key){
        console.log('mandatory_fields', val);
        if($scope.cart_object['standard_measurement_attributes'] && $scope.cart_object['standard_measurement_attributes'][val] && $scope.cart_object['standard_measurement_attributes'][val].value && $scope.cart_object['standard_measurement_attributes'][val].value!==''){
          valid_measurements.push(true);
        }
        else{
          $scope.invalid_fields.push(val);
          valid_measurements.push(false);
        }
      })
      if(valid_measurements.indexOf(false)==-1){
        return true;
      }
      else{
        return false;
      }
    }
    else{
      return true;
    }
  };
  $scope.add_to_cart = function(variant){
    console.log('add to cart', variant);
    console.log('luxire_cart', $rootScope.luxire_cart);
    console.log('has valid measurements', has_valid_measurements());
    if(has_valid_measurements()){
      if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items){
        CustomerOrders.add_line_item($rootScope.luxire_cart, $scope.cart_object, variant)
        .then(function(data){
          CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
            $rootScope.luxire_cart = data.data;
            $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
            $state.go('customer.pre_cart');
          }, function(error){
            console.error(error);
          });
          console.log(data);
        },function(error){
          $rootScope.alerts.push({type: 'danger', message: 'Failed to add to cart'});
          console.error(error);
        });
      }
      else{
        CustomerOrders.create_order($scope.cart_object, variant, $scope.measurement_sample)
        .then(function(data){
          $rootScope.luxire_cart = data.data;
          $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
          $state.go('customer.pre_cart');
          console.log(data);
        },function(error){
          $rootScope.alerts.push({type: 'danger', message: 'Failed to add to cart'});
          console.error(error);
        });
      }
    }
    else{
      $rootScope.alerts.push({type: 'danger', message: 'Please fill mandatory field '+$scope.invalid_fields[0]});
    }
  };

  var style_iterator = function(style, attribute_type, is_selected){
    console.log('style iterator for: ', style,'of type, : ',attribute_type,'is selected', is_selected);
    console.log('cart object b4', $scope.cart_object);
    angular.forEach($scope.cart_object[attribute_type], function(value, key){
      if(!is_selected){
        if(style[attribute_type][key] && style[attribute_type][key]!==''){
          $scope.cart_object[attribute_type][key]['value'] = '';
        }
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
    console.log('cart object after', $scope.cart_object);

    return;

  };

  $scope.style_extractor = function(style, is_selected){
    console.log('cart_object in style extractor',$scope.cart_object);
    console.log('extracted style', style);
    $scope.active_style = style;
    $scope.cart_object.selected_style = style;
    style_iterator(style.default_values, "customization_attributes",is_selected);
    style_iterator(style.default_values, "standard_measurement_attributes", is_selected);
    style_iterator(style.default_values, "body_measurement_attributes", is_selected);
    // if(is_selected){
    //   style_iterator(style.default_values, "customization_attributes",true);
    //   style_iterator(style.default_values, "standard_measurement_attributes", true);
    //   style_iterator(style.default_values, "body_measurement_attributes", true);
    // }
    // else{
    //   style_iterator();
    // }
    console.log('cart_object',$scope.cart_object);
    return;
  };

  $scope.revert_style = function(){
    style_iterator();
  };

  var prev_fit_type = '';
  var new_fit_type = '';
  $scope.active_style = {};//Selected style accross modals
  $scope.choose_style = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'choose_style.html',
      controller: 'ChooseStyleController',
      size: 'lg',
      windowClass: 'choose-style-window',
      resolve: {
        luxire_styles: function () {
          return $scope.product.luxire_style_masters;
        },
        active_style: function(){
          return $scope.active_style;
        },
        parent_scope: function(){
          return $scope;
        }
      }
    });
    modal_instance.result.then(function (selected_style) {
      // console.log('selected style', selected_style, 'has_style_changed', selected_style.has_style_changed, 'is_selected', selected_style.is_selected);
      // if(selected_style.has_style_changed){
      //   delete selected_style.has_style_changed;
      //   delete selected_style.is_selected;
      //   if(selected_style && selected_style.name){
      //     prev_fit_type = 'Custom';
      //     $scope.cart_object["standard_measurement_attributes"]["Fit Type"].value = 'Custom';
      //     $scope.style_extractor(selected_style, true);
      //   }
      //   else{
      //     $scope.style_extractor($scope.active_style, false);
      //   }
      // }
    }, function () {
      if($scope.active_style && $scope.active_style.name){
        prev_fit_type = 'Custom';
        $scope.cart_object["standard_measurement_attributes"]["Fit Type"].value = 'Custom';
      }
      console.info('Modal dismissed at: ' + new Date());
    });
    modal_instance.opened.then(function(){
      console.log('fired open with', $(document.body));
      $timeout(function(){
        var $body = $(document.body);
        var oldWidth = $body.innerWidth();
        console.log('oldWidth', oldWidth);
        $body.css("overflow", "hidden !important");
        $body.width(oldWidth);
        console.log('new body width', $body);
        console.log('new doc body width', $(document.body));

      },0);
    });
    // modal_instance.closed.then(function(){
    //   var $body = $(document.body);
    //   $body.css("overflow", "auto");
    //   $body.width("auto");
    // });

  };

  $scope.show_summary = function(){
    console.log('show summary with base style', $scope.active_style);
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'summary.html',
      controller: 'SummaryController',
      size: 'lg',
      windowClass: 'summary-window',
      resolve: {
        product: function(){
          return $scope.product;
        },
        cart_object: function () {
          return $scope.cart_object;
        },
        base_style: function(){
          return $scope.active_style;
        }

      }
    });
    modal_instance.result.then(function (selected_style) {
      console.log('selected style', selected_style);
      $scope.active_style = selected_style;
      $scope.style_extractor(selected_style);
      $scope.cart_object.selected_style = selected_style;
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
    modal_instance.opened.then(function(){
      console.log('fired open with', $(document.body));
      $timeout(function(){
        var $body = $(document.body);
        var oldWidth = $body.innerWidth();
        console.log('oldWidth', oldWidth);
        $body.css("overflow", "hidden !important");
        $body.width(oldWidth);
        console.log('new body width', $body);
        console.log('new doc body width', $(document.body));

      },0);
    });

  }

  $scope.get_standard_sizes = function(){
    console.log('get std sizes for fit');
    new_fit_type = $scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"];
    if(prev_fit_type.toLowerCase() === 'custom' && new_fit_type.toLowerCase() !== 'custom'){
      console.log('change in fit type');
      // $scope.style_extractor();
    }

  //   if($scope.cart_object["standard_measurement_attributes"]["Neck Size"] && $scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"] &&
  //      $scope.cart_object["standard_measurement_attributes"]["Fit Type"] && $scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"]){
  //        console.log($scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"]);
  //        console.log($scope.cart_object["standard_measurement_attributes"]["Sleeve Length"]["value"]);
  //        console.log($scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"]);
  //        console.log('making request');
  //        CustomerProducts.standard_sizes($scope.cart_object["standard_measurement_attributes"]["Fit Type"]["value"],
  //         $scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"],
  //         $scope.cart_object["standard_measurement_attributes"]["Sleeve Length"]["value"])
  //        .then(function(data){
  //          if(data.data && !data.data.msg){
  //            console.log('std sizes', data);
  //            $scope.cart_object["standard_measurement_attributes"]["Neck Size"]["value"] = data.data['neck'];
  //            $scope.cart_object["body_measurement_attributes"]["Chest Around"]["value"] = data.data['chest'];
  //            $scope.cart_object["body_measurement_attributes"]["Waist Around"]["value"] = data.data['waist'];
  //           //  $scope.cart_object["standard_measurement_attributes"]["Bottom"]["value"] = data.data['bottom'];
  //           //  $scope.cart_object["standard_measurement_attributes"]["Biceps"]["value"] = data.data['biceps'];
  //            $scope.cart_object["standard_measurement_attributes"]["Yoke Width"]["value"] = data.data['yoke'];
  //            $scope.cart_object["body_measurement_attributes"]["Wrist Around"]["value"] = data.data['wrist'];
  //            $scope.cart_object["standard_measurement_attributes"]["Sleeve Length"]["value"] = data.data['shirt_length'];
  //          };
  //        },function(error){
  //          console.log(error);
  //        });
  //  }


  };


  // $scope.bespoke_style = function(){
  //   var modal_instance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'bespoke_style.html',
  //     controller: 'BespokeStyleController',
  //     size: 'lg',
  //     windowClass: 'bespoke-style-window',
  //     resolve: {
  //       product: function () {
  //         return $scope.product;
  //       },
  //       cart_object: function(){
  //         return $scope.cart_object;
  //       },
  //       parent_scope: function(){
  //         return $scope;
  //       },
  //       active_style: function(){
  //         return $scope.active_style;
  //       }
  //     }
  //   });
  //   modal_instance.result.then(function (response_object) {
  //     $scope.cart_object = response_object.cart_object;
  //     $scope.active_style = response_object.active_style;
  //     $scope.display_summary = true;
  //     console.log('bespoke controller returned', response_object);
  //   }, function () {
  //     console.info('Modal dismissed at: ' + new Date());
  //   });

  // };

  // $scope.standard_measurement = function(){
  //   var modal_instance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'standard_measurements.html',
  //     controller: 'StandardMeasurementController',
  //     size: 'lg',
  //     windowClass: 'bespoke-style-window',
  //     resolve: {
  //       product: function () {
  //         return $scope.product;
  //       },
  //       cart_object: function(){
  //         return $scope.cart_object;
  //       },
  //       parent_scope: function(){
  //         return $scope;
  //       }
  //     }
  //   });
  //   modal_instance.result.then(function (cart_object) {
  //     console.log(cart_object);
  //     $scope.cart_object = cart_object;
  //     $scope.display_summary = true;
  //   }, function () {
  //     console.info('Modal dismissed at: ' + new Date());
  //   });

  // };

  // $scope.body_measurement = function(){
  //   var modal_instance = $uibModal.open({
  //     animation: true,
  //     templateUrl: 'body_measurements.html',
  //     controller: 'BodyMeasurementController',
  //     size: 'lg',
  //     windowClass: 'bespoke-style-window',
  //     resolve: {
  //       product: function () {
  //         return $scope.product;
  //       },
  //       cart_object: function(){
  //         return $scope.cart_object;
  //       },
  //       parent_scope: function(){
  //         return $scope;
  //       }
  //     }
  //   });
  //   modal_instance.result.then(function (cart_object) {
  //     console.log(cart_object);
  //     $scope.cart_object = cart_object;
  //     $scope.display_summary = true;
  //   }, function () {
  //     console.info('Modal dismissed at: ' + new Date());
  //   });

  // };

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

    $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
    $scope.get_standard_sizes();
  };


  $scope.make_my_own_style = function(event){
    $scope.is_bespoke_style = !$scope.is_bespoke_style;
    // console.log('scrolling');
    // $('html, body').animate({ scrollTop:$("#make_my_own_style").offset().top-120}, 500);
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
  var slideEnd=5;
  $scope.hideNext= $scope.product.luxire_style_masters != undefined && $scope.product.luxire_style_masters.length>5 ? false : true;
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
    if($scope.active_style.name == style.name){
      $scope.active_style = {};
      $scope.style_extractor();
      console.log($scope.cart_object);
    }
    else{
      $scope.active_style = style;
      $scope.style_extractor(style);
      console.log($scope.cart_object);
    };

    // if($scope.active_style_index == index){
    //   $scope.active_style_index = -1;
    //   $scope.style_extractor();
    //   console.log($scope.cart_object);
    // }
    // else{
    //   $scope.active_style_index = index;
    //   $scope.style_extractor(style);
    //   console.log($scope.cart_object);
    // };
  };


  /*New Mockup July 1 changes*/
  $scope.invoke_choose_fit_and_measurement = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'choose_fit_and_measurement.html',
      controller: 'ChooseFitAndMeasurementController',
      size: 'lg',
      windowClass: 'fit-and-measurement-window',
      resolve: {
        product: function () {
          console.log("invoking fit", $scope.selected_measurement_unit, $scope.product_in_cm);
          // return $scope.selected_measurement_unit === "in" ? $scope.product : $scope.product_in_cm;
          return $scope.product;
        },
        cart_object: function(){
          return angular.copy($scope.cart_object);
        },
        standard_measurement_attributes: function(){
          // return $scope.selected_measurement_unit === "in" ? $scope.standard_measurement_attributes : $scope.standard_measurement_attributes_in_cm;
           return $scope.standard_measurement_attributes;
        },
        body_measurement_attributes: function(){
          return $scope.body_measurement_attributes;
        },
        selected_measurement_id: function(){
          return $scope.selected_measurement_id;
        },
        selected_measurement_unit: function(){
          return $scope.selected_measurement_unit;
        }

      }
    });
    modal_instance.result.then(function (measurements_object) {
      console.log('selected measuremnts', measurements_object);
      console.log('cart object b4', $scope.cart_object);
      console.log('cart object prototype', $scope.cart_object_prototype);
      $scope.selected_measurement_id = measurements_object.selected_measurement_id;
      if($scope.selected_measurement_id===3){
        $scope.cart_object.body_measurement_attributes = angular.copy(measurements_object.selected_measurements);
        $scope.cart_object.standard_measurement_attributes = angular.copy($scope.cart_object_prototype.standard_measurement_attributes);
      }
      else if($scope.selected_measurement_id===4){
        $scope.cart_object.body_measurement_attributes = angular.copy($scope.cart_object_prototype.body_measurement_attributes);
        $scope.cart_object.standard_measurement_attributes = angular.copy($scope.cart_object_prototype.standard_measurement_attributes);
      }
      else{
        console.log('case 1 or 2', $scope.cart_object_prototype)
        $scope.cart_object.body_measurement_attributes = angular.copy($scope.cart_object_prototype.body_measurement_attributes);
        $scope.cart_object.standard_measurement_attributes = angular.copy(measurements_object.selected_measurements);
      }

      // console.log('cart object after', $scope.cart_object);
      $scope.display_summary = true;
      console.log('selected_measurements', measurements_object);
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.invoke_choose_a_style = function(){
    var modal_instance = $uibModal.open({
      animation: true,
      templateUrl: 'select_a_style.html',
      controller: 'SelectStyleController',
      size: 'lg',
      windowClass: 'select-style-window',
      resolve: {
        product: function () {
          return $scope.selected_measurement_unit === "in" ? $scope.product : $scope.product_in_cm;
        },
        cart_object: function(){
          return angular.copy($scope.cart_object);
        },
        luxire_styles: function () {
          return $scope.product.luxire_style_masters;
        },
        active_style: function(){
          return $scope.active_style;
        },
        parent_scope: function(){
          return $scope;
        }

      }
    });
    modal_instance.result.then(function (response_object) {
      console.log('response_object', response_object);
      $scope.active_style = response_object.active_style;
      $scope.cart_object = response_object.cart_object;
      $scope.display_summary = true;
      console.log('bespoke style controller returned', response_object);
    }, function () {
      console.info('Modal dismissed at: ' + new Date());
    });
  };



})
.controller('ChooseFitAndMeasurementController', ['$scope', '$uibModalInstance', 'product', 'cart_object', 'standard_measurement_attributes', 'body_measurement_attributes','selected_measurement_id', 'selected_measurement_unit',function($scope, $uibModalInstance, product, cart_object, standard_measurement_attributes, body_measurement_attributes, selected_measurement_id, selected_measurement_unit){
  console.log('product', product);
  console.log('cart_object', cart_object);
  $scope.standard_measurement_attributes = standard_measurement_attributes;
  $scope.product = product;
  $scope.measurement_unit = {
    selected: selected_measurement_unit
  };

  var standard_size_chart = {
    "shirts": {
      "Collar Size": {
        "regular": {
          "base": 15.00,
          "step": 0.25
        },
        "slim": {
          "base": 15.00,
          "step": 0.25
        },
        "super slim": {
          "base": 15.00,
          "step": 0.25
        }
      },
      "Chest": {
        "regular": {
          "base": 47.00,
          "step": 1.00
        },
        "slim": {
          "base": 44.50,
          "step": 1.00
        },
        "super slim": {
          "base": 41.50,
          "step": 1.00
        }
      },
      // "Waist": {
      //   "regular": {
      //     "base": 44.00,
      //     "step": 1.00
      //   },
      //   "slim": {
      //     "base": 40.00,
      //     "step": 1.00
      //   },
      //   "super slim": {
      //     "base": 39.00,
      //     "step": 1.00
      //   }
      // },
      "Bottom": {
        "regular": {
          "base": 47.00,
          "step": 1.00
        },
        "slim": {
          "base": 44.00,
          "step": 1.00
        },
        "super slim": {
          "base": 41.00,
          "step": 1.00
        }

      },
      "Yoke Width": {
        "regular": {
          "base": 18.00,
          "step": 0.25
        },
        "slim": {
          "base": 18.00,
          "step": 0.25
        },
        "super slim": {
          "base": 18.00,
          "step": 0.25
        }
      },
      // "Biceps": {
      //   "regular": {
      //     "base": 9.75,
      //     "step": 0.13
      //   },
      //   "slim": {
      //     "base": 9.00,
      //     "step": 0.13
      //   },
      //   "super slim": {
      //     "base": 8.50,
      //     "step": 0.13
      //   }
      //
      // },
      // "Wrist": {
      //   "regular": {
      //     "base": 8.75,
      //     "step": 0.13
      //   },
      //   "slim": {
      //     "base": 8.75,
      //     "step": 0.13
      //   },
      //   "super slim": {
      //     "base": 8.75,
      //     "step": 0.13
      //   }
      // },
      // "Shirt Length": {
      //   "regular": {
      //     "base": 33.00,
      //     "step": 0.25
      //   },
      //   "slim": {
      //     "base": 31.00,
      //     "step": 0.25
      //   },
      //   "super slim": {
      //     "base": 31.00,
      //     "step": 0.25
      //   }
      // }
    },
    "pants": {
      "Waist(rounded)": {
        "regular": {
          "base": 28.00,
          "step": 1.00
        },
        "slim": {
          "base": 28.00,
          "step": 1.00
        },
        "super slim": {
          "base": 28.00,
          "step": 1.00
        }
      },
      "Hip(rounded)": {
        "regular": {
          "base": 36.75,
          "step": 1.00
        },
        "slim": {
          "base": 36.00,
          "step": 1.00
        },
        "super slim": {
          "base": 35.25,
          "step": 1.00
        }

      },
      "In-seam": {
        "regular": {
          "base": 32.00,
          "step": 1.00
        },
        "slim": {
          "base": 32.00,
          "step": null
        },
        "super slim": {
          "base": 32.00,
          "step": 1.00
        }
      },
      "Front Rise": {
        "regular": {
          "base": 10.00,
          "step": 0.125
        },
        "slim": {
          "base": 9.50,
          "step": 0.125
        },
        "super slim": {
          "base": 9.00,
          "step": 0.125
        }

      },
      "Back Rise": {
        "regular": {
          "base": 14.50,
          "step": 0.125
        },
        "slim": {
          "base": 13.750,
          "step": 0.125
        },
        "super slim": {
          "base": 13.00,
          "step": 0.125
        }

      },
      "Thigh(rounded)": {
        "regular": {
          "base": 22.25,
          "step": 0.50
        },
        "slim": {
          "base": 21.750,
          "step": 0.50
        },
        "super slim": {
          "base": 21.25,
          "step": 0.50
        }

      },
      "Knee(rounded)": {
        "regular": {
          "base": 16.00,
          "step": 0.375
        },
        "slim": {
          "base": 15.00,
          "step": 0.375
        },
        "super slim": {
          "base": 14.00,
          "step": 0.375
        }

      },
      "Bottom(rounded)": {
        "regular": {
          "base": 13.75,
          "step": 0.25
        },
        "slim": {
          "base": 13.00,
          "step": 0.25
        },
        "super slim": {
          "base": 12.25,
          "step": 0.25
        }
      },
      "Outseam": {
        "regular": {
          "base": 43.00,
          "step": null
        },
        "slim": {
          "base": 42.50,
          "step": null
        },
        "super slim": {
          "base": 42.00,
          "step": null
        }

      }
    }
  }




  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  var product_type = capitalizeFirstLetter($scope.product.product_type.product_type.slice(0,-1));
  $scope.allow_edit = false;
  $scope.measurement_types = [
    {
      id: 1,
      header: "Standard",
      sub_header: "Choose from standard sizes"
    },
    {
      id: 2,
      header: "Custom",
      sub_header: "Customize your fit types"
    },
    {
      id: 3,
      header: "Body Measurements",
      sub_header: "Provide your exact body measurements for the perfect fit type"
    },
    {
      id: 4,
      header: "Send "+product_type+" Sample",
      sub_header: "Send us your "+product_type+" sample to exactly replicate or modify"
    }
  ];
  $scope.active_measurement_type_id = selected_measurement_id || 1;
  $scope.change_measurement_type = function(id){
    $scope.active_measurement_type_id = id;

  };

  var set_standard_sizes = function(){
    var product_type = $scope.product.product_type.product_type.toLowerCase();
    var fit_type = $scope.cart_object['standard_measurement_attributes']['Fit Type']['value'];
    if(product_type === "shirts"){
      if(fit_type && $scope.cart_object['standard_measurement_attributes']['Collar Size']['value'] && $scope.cart_object['standard_measurement_attributes']['Sleeve Length']['value']){
        fit_type = fit_type.toLowerCase();
        for(var attr in standard_size_chart['shirts']){
          if(standard_size_chart['shirts'][attr][fit_type]['step']){
            if(selected_measurement_unit == "in"){
              $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (($scope.cart_object['standard_measurement_attributes']['Collar Size']['value']-standard_size_chart['shirts']['Collar Size'][fit_type]['base'])*4*standard_size_chart['shirts'][attr][fit_type]['step'])+standard_size_chart['shirts'][attr][fit_type]['base'];
            }
            else if(selected_measurement_unit == "cm"){
              $scope.cart_object['standard_measurement_attributes'][attr]['value'] = ((($scope.cart_object['standard_measurement_attributes']['Collar Size']['value']/2.54)-standard_size_chart['shirts']['Collar Size'][fit_type]['base'])*4*standard_size_chart['shirts'][attr][fit_type]['step'])+standard_size_chart['shirts'][attr][fit_type]['base'];
            }
          }

          if(selected_measurement_unit == "in"){
            $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value']))*1000)/1000).toFixed(3);
          }
          else if(selected_measurement_unit == "cm"){
            $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value'])*2.54)*10)/10).toFixed(2);
          }
          $scope.change_dependents('standard_measurement_attributes', attr, $scope.cart_object['standard_measurement_attributes'][attr]['value']);

        }

      }

    }
    else if (product_type === "pants") {
      if(fit_type && $scope.cart_object['standard_measurement_attributes']['Waist(rounded)']['value'] && $scope.cart_object['standard_measurement_attributes']['In-seam']['value']){
        fit_type = fit_type.toLowerCase();
        for(var attr in standard_size_chart['pants']){
          if(attr !== "Outseam"){
            if(standard_size_chart['pants'][attr][fit_type]['step']){
              if(selected_measurement_unit == "in"){
                $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (($scope.cart_object['standard_measurement_attributes']['Waist(rounded)']['value']-standard_size_chart['pants']['Waist(rounded)'][fit_type]['base'])*standard_size_chart['pants'][attr][fit_type]['step'])+standard_size_chart['pants'][attr][fit_type]['base'];
              }
              else if(selected_measurement_unit == "cm"){
                $scope.cart_object['standard_measurement_attributes'][attr]['value'] = ((($scope.cart_object['standard_measurement_attributes']['Waist(rounded)']['value']/2.54)-standard_size_chart['pants'][attr][fit_type]['base'])*standard_size_chart['pants'][attr][fit_type]['step'])+standard_size_chart['pants'][attr][fit_type]['base'];
              }
            }
          }
          else{
            $scope.cart_object['standard_measurement_attributes']['Outseam']['value'] = parseFloat($scope.cart_object['standard_measurement_attributes']['In-seam']['value']) + parseFloat($scope.cart_object['standard_measurement_attributes']['Front Rise']['value']) + 1;
          }
          if(selected_measurement_unit == "in"){
            $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value']))*1000)/1000).toFixed(3);
          }
          else if(selected_measurement_unit == "cm"){
            $scope.cart_object['standard_measurement_attributes'][attr]['value'] = (Math.round((parseFloat($scope.cart_object['standard_measurement_attributes'][attr]['value'])*2.54)*10)/10).toFixed(2);
          }
          $scope.change_dependents('standard_measurement_attributes', attr, $scope.cart_object['standard_measurement_attributes'][attr]['value']);

        }

      }
    }

    // console.log('standard_sizes set', $scope.cart_object);
  };

  /*This utility method assigns value to attribute & invokes functions to set std sizes and change dependents*/
  $scope.set_attribute_value = function(attribute_type, attribute_key, attribute_value){
    $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
    set_standard_sizes();
    $scope.change_dependents(attribute_type, attribute_key, attribute_value);
  };

  $scope.change_attribute_value = function(attribute_type, attribute_key, attribute_value){
    $scope.cart_object[attribute_type][attribute_key]['value'] = attribute_value;
    $scope.change_dependents(attribute_type, attribute_key, attribute_value);
  };

  /*Check dependents and set dependents*/
  $scope.change_dependents = function(attr_type, attr_name, attr_value){
    console.log('attr type', attr_type, 'attr_name', attr_name, 'attr_value',attr_value);
    if(attr_name.indexOf('(') !== -1 && key_name_map[attr_name.trim().toLowerCase().split('(')[0].trim()]){//dependent child
      $scope.cart_object[attr_type][key_name_map[attr_name.trim().toLowerCase().split('(')[0].trim()]]['value'] = "";

    }
    else if(attr_name.indexOf('(')  === -1 && dependent_attrs.hasOwnProperty(attr_name.trim().toLowerCase())){//dependent parent
      console.log('dependent', dependent_attrs[attr_name.trim().toLowerCase()]);
      angular.forEach(dependent_attrs[attr_name.trim().toLowerCase()], function(val, key){
        console.log('dependent', key_name_map[val]);

        $scope.cart_object[attr_type][key_name_map[val]]['value'] = attr_value;
                console.log('dependent', $scope.cart_object[attr_type]);

      });
    }

  };

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
    $scope.cart_object = cart_object;


  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
  $scope.print_cart = function(){
        // console.log('cart_object',$scope.cart_object.standard_measurement_attributes);

  }

  $scope.next_step = function(){
    var measurements = {};
    if($scope.active_measurement_type_id === 3){
      measurements = $scope.cart_object.body_measurement_attributes;
    }
    else if($scope.active_measurement_type_id === 4){
      measurements = {};
    }
    else{
      measurements = $scope.cart_object.standard_measurement_attributes;
    }


    console.log('cart_object before close',cart_object);
    console.log('selected measuremnet', measurements);

    $uibModalInstance.close({
      selected_measurement_id: $scope.active_measurement_type_id,
      selected_measurements: measurements
    });
  };

  $scope.checkIsArray = function(style_value){

    if(angular.isArray(style_value)){
      return true;
    }
    else{
      return false;
    }
  };

  var key_name_map = {};
  var dependent_attrs = {};
  angular.forEach(product['standard_measurement_attributes'], function(val, key){
    key_name_map[val.name.trim().toLowerCase()] = val.name;
    if(val.name.trim().toLowerCase().indexOf('(') !== -1){
      if(!dependent_attrs.hasOwnProperty(val.name.trim().toLowerCase().split('(')[0].trim())){
        dependent_attrs[val.name.trim().toLowerCase().split('(')[0].trim()] = [];
      }
      dependent_attrs[val.name.trim().toLowerCase().split('(')[0].trim()].push(val.name.trim().toLowerCase());
    }
  });

}])
.controller('SelectStyleController', ['$scope', '$uibModalInstance', 'ImageHandler', 'product', 'cart_object', 'luxire_styles','active_style','parent_scope','$state', 'CustomerConstants', '$filter', '$timeout', '$uibPosition', '$sce', function($scope, $uibModalInstance, ImageHandler, product, cart_object, luxire_styles,active_style,parent_scope,$state, CustomerConstants, $filter, $timeout, $uibPosition, $sce){
  console.log('product', product);
  $scope.active_style_option = "system_preset";
  $scope.change_active_style_option = function(option){
    $scope.active_style_option = option;
    $('#prev-attr').click();
  };

  /*Select Style functionality */
  console.log(luxire_styles);
  $scope.luxire_styles = luxire_styles;
  $scope.selectSliderIndex=-1;
  $scope.selected_style = active_style;
  $scope.hide_active_style_details = true;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  $scope.active_detail_style = {};
  $scope.toggle_detailed_style = function(style, toggle){
    console.log('show style', style);
    console.log('toggle', toggle);
    $scope.hide_active_style_details = false;
    $scope.active_detail_style = !toggle ? style : {};
    console.log('active detail style', $scope.active_detail_style);
  };

  $scope.init_active_style = function(style){
    console.log('init style', style, $scope.getImage(style.images.large_url));
    $scope.active_detail_style_image = $scope.getImage(style.images.large_url);
  };
  $scope.change_active_style_image = function(image){
    $scope.active_detail_style_image = $scope.getImage(image.large);
  };

  $scope.aggregated_style_images = [];
  $scope.set_aggregated_style_images = function(style){
    if(style && Object.keys(style).length){
      $scope.aggregated_style_images = [];
      $scope.aggregated_style_images = angular.copy(style.real_images);
      $scope.aggregated_style_images = $scope.aggregated_style_images.concat(style.sketch_images);
      $scope.aggregated_style_images.splice(0,0,{ large: style.images.large_url,medium: style.images.medium_url, small: style.images.small_url});
    }
  };

  var style_iterator = function(style, attribute_type, is_selected){
    console.log('style iterator for: ', style,'of type, : ',attribute_type,'is selected', is_selected);
    console.log('cart object b4', $scope.cart_object);
    angular.forEach($scope.cart_object[attribute_type], function(value, key){
      if(!is_selected){
        if(style[attribute_type][key] && style[attribute_type][key]!==''){
          $scope.cart_object[attribute_type][key]['value'] = '';
        }
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
    console.log('cart object after', $scope.cart_object);

    return;

  };


  $scope.style_extractor = function(style, is_selected){
    console.log('cart_object in style extractor',$scope.cart_object);
    console.log('extracted style', style);
    $scope.active_style = style;
    $scope.cart_object.selected_style = style;
    style_iterator(style.default_values, "customization_attributes",is_selected);
    style_iterator(style.default_values, "standard_measurement_attributes", is_selected);
    style_iterator(style.default_values, "body_measurement_attributes", is_selected);
    // if(is_selected){
    //   style_iterator(style.default_values, "customization_attributes",true);
    //   style_iterator(style.default_values, "standard_measurement_attributes", true);
    //   style_iterator(style.default_values, "body_measurement_attributes", true);
    // }
    // else{
    //   style_iterator();
    // }
    console.log('cart_object',$scope.cart_object);
    return;
  };

  $scope.revert_style = function(){
    style_iterator();
  };

  $scope.get_style_description_as_html = function(description){
    return $sce.trustAsHtml(description);
  };




  $scope.style_detail_images = [];
  $scope.activate_style_details = function(style){
    if(!$scope.selected_style.name){
      $scope.style_detail_images = [];
      $scope.hide_active_style_details = false;
      $scope.active_detail_style = style;
      $scope.style_detail_images = $scope.active_detail_style.sketch_images;
      $scope.set_aggregated_style_images(style);
    }
  }

  $(document).ready(function(){
      $timeout(function () {
        var slides_to_scroll = 5;
        $('.slick-bespoke-style-slider').slick({
          slidesToShow: slides_to_scroll,
          slidesToScroll: 1,
          centerMode: true,
          focusOnSelect: true
          // ,
          // prevArrow: $('#prev-style'),
          // nextArrow: $('#next-style')
        });
        function fetch_slick(key){
          var slick = $('.slick-bespoke-style-slider').slick('getSlick');
          if(key){
            return slick[key];
          }
          else{
            return slick;
          }
        }
        $('#prev-style').addClass('slick-arrow');
        $('#next-style').addClass('slick-arrow');
        var slick = fetch_slick();
        var slide_count = fetch_slick('slideCount');

        $('#next-style').click(function(){
          $('.slick-bespoke-style-slider').slick('slickNext');
        });
        $('#prev-style').click(function(){
          $('.slick-bespoke-style-slider').slick('slickPrev');
        });



        var attr_to_show = 4;
        $('.bespoke-attributes-slider').slick({
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          vertical: true
        });
        $('#prev-attr').addClass('slick-arrow');
        $('#next-attr').addClass('slick-arrow');
        function fetch_slick_attrs(key){
          var slick = $('.bespoke-attributes-slider').slick('getSlick');
          if(key){
            return slick[key];
          }
          else{
            return slick;
          }
        }
        var attr_count = fetch_slick_attrs('slideCount');
        if(attr_count>attr_to_show){
          $('#prev-attr').addClass('slick-disabled');
        }
        else{
          $('#prev-attr').addClass('slick-hidden');
          $('#next-attr').addClass('slick-hidden');
        }
        $('#next-attr').click(function(){
          var slick= fetch_slick_attrs();
          if((slick.currentSlide+attr_to_show-1)<(attr_count-1)){
            $('.bespoke-attributes-slider').slick('slickNext');
            $('#prev-attr').removeClass('slick-disabled');
            slick= fetch_slick_attrs();
          }
          if((slick.currentSlide+attr_to_show-1)===(attr_count-1)){
            $('#next-attr').addClass('slick-disabled');
          }
        });
        var prev_attr_init = true;
        $('#prev-attr').click(function(){
          var slick= fetch_slick_attrs();
          if(slick.currentSlide>0){
            $('.bespoke-attributes-slider').slick('slickPrev');
            $('#next-attr').removeClass('slick-disabled');
            slick= fetch_slick_attrs();
          }
          if(slick.currentSlide==0){
            $('#prev-attr').addClass('slick-disabled');
          }
        });
        $('#next-attr').click();


        $('.bespoke-attributes-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
          console.log('n', nextSlide);
          $scope.activate_bespoke_attribute($scope.product['bespoke_attributes'][nextSlide]);
          // $scope.$digest();
        });


        $scope.activate_bespoke_attribute($scope.product['bespoke_attributes'][0]);

      }, 0);

  });

  $scope.selectSlider=function(index, selected_style){
    console.log("index: "+index);
    $scope.selectSliderIndex=index;
    $scope.selected_style = selected_style;
  };
  $scope.select_style = function(index, style){
    console.log("index: "+index);
    console.log('style', style);
    if($scope.selected_style.name === style.name){
      $scope.selected_style = {};
      $scope.style_extractor(style, false);
    }
    else{
      $scope.selected_style = {};//added to disable detail change on style selected
      $scope.activate_style_details(style);//added to disable detail change on style selected
      $scope.selected_style = style;
      $scope.style_extractor(style, true);
    };
  };
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
  $scope.edit_style = function(){
    $scope.change_active_style_option("bespoke");
  };


  /*Bespoke Style Functionality */
  $scope.product = product;
  $scope.cart_object = cart_object;
  $scope.product['bespoke_attributes'] = product['customization_attributes'].concat(product['personalization_attributes']);
  $scope.product['bespoke_attributes'] = $filter('orderBy')($scope.product['bespoke_attributes'], 'id');
  $scope.product['customization_attributes'] = $filter('orderBy')($scope.product['customization_attributes'], 'id');
  $scope.active_style = active_style;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };




  /*Slick wheeler/slider*/

  $scope.more_details = function(attr_name, attr_type){
    attr_name = attr_name.toLowerCase().split(" ").join("-");
    attr_type = attr_type.toLowerCase().split(" ").join("-");
    console.log('more details on', attr_name, attr_type);

    window.open('/#/attributes/'+attr_name+'?type='+attr_type, '_blank')
  };

  $scope.attr_options_key_length = function(options_obj){
    if(options_obj && angular.isObject(options_obj)){
      return Object.keys(options_obj).length;
    }
    else{
      return 0;
    }
  };

  $scope.view_measurements = {
    templateUrl: 'view_measurements_popover.html'
  };

  $scope.enlarge_style = function(style, element){
    $scope.enlarge_image_xpos = element.clientX-360;
    $scope.enlarge_image_ypos = element.clientY-30;
    $scope.enlarged_style = style;

  };

  $scope.upload_custom_image = function(files, index){
    console.log('attr image', files[0]);
    console.log('index', index);
    if (files && files.length) {
      console.log('custom image');
      ImageHandler.custom_image_upload(files[0])
      .then(function(data){
        $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'][index].url = data.data.image;
        console.log(data);
      }, function(error){
        console.error(error);
      });
    }
  }

  /*Add custom images*/
  $scope.add_custom_image = function(){
    console.log('add custom images');
    if(!$scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
     || ($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
     && !angular.isArray($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']))){
       $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'] = [];
     }
     $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].push({
       url: '',
       notes: ''
     });
  };

  $scope.delete_custom_image = function(index){
    $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].splice(index, 1);
  };

  /*Check whether to display in view r not*/
  $scope.check_unpermitted_customization_params = function(attribute, key){
    var unpermitted_params_non_custom = ['image','url','help','help_url', 'help_image', 'cost'];
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
    console.log('dismiss');
    $uibModalInstance.dismiss('cancel');
  };

  $scope.next_step = function(){
    console.log('closing bespoke cart_object', $scope.cart_object);
    console.log('closing bespoke style', $scope.active_style);
    $uibModalInstance.close({
      cart_object: $scope.cart_object,
      active_style: $scope.selected_style
    });
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


  /*Bespoke attributes*/
  $scope.activate_bespoke_attribute = function(bespoke_attribute){
    $scope.selected_bespoke_attribute = bespoke_attribute;
    console.log('selected_bespoke_attribute', bespoke_attribute);
  };
  var obj_keys = [];
  $scope.personalization_options = {};
  //activate and deactivate a bespoke style
  $scope.activate_bespoke_style = function(attr_type, style_object, index, style_name){
    console.log('activate style', attr_type, style_object, index, style_name);

    if(attr_type == 'customize'){
      if($scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value']==style_name){
        if(style_object.cost){
          $scope.remove_personalization_cost(style_object.cost);
          delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name];
        }
         $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] = '';
         $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
         delete $scope["customization_attributes"][$scope.selected_bespoke_attribute.name];
     }
     else{
       if(style_object.cost){
         if($scope.cart_object["personalization_attributes"] && !$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
           $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]= {};
         }
         if($scope.cart_object["personalization_attributes"] && $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
           obj_keys = Object.keys($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]);
           if(obj_keys.length){
             $scope.remove_personalization_cost($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][obj_keys[0]]['cost']);
             delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][obj_keys[0]];
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
             $scope.add_personalization_cost(style_object.cost);
           }
           else{
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
             $scope.add_personalization_cost(style_object.cost);
           }
         }
       }
       $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] = style_name;
       if(!angular.isObject($scope["customization_attributes"])){
         $scope["customization_attributes"] = {};
       };
       if(angular.isObject($scope["customization_attributes"]) && !angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name])){
         $scope["customization_attributes"][$scope.selected_bespoke_attribute.name] = {};
       };
       if(angular.isObject($scope["customization_attributes"]) && angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name]) && !angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name]["options"])){
         $scope["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
       }
       console.log($scope["customization_attributes"]);
       console.log('style_object', style_object);

       angular.forEach(style_object, function(val, key){
         console.log('style_object key', key );
         if($scope.check_unpermitted_customization_params($scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'], key)){
           /*Change 15 March 2015 to set default*/
           $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'][key] = angular.isObject(style_object[key])? style_object[key].default : style_object[key];
           console.log('attr for order_sheet',$scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options']);
         }
       });
       $scope["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = style_object;
     }
    }
    else if(attr_type == 'personalize'){
      console.log('style obj', style_object);
      console.log('style name', style_name);
      console.log('personalize', $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]);
      if($scope.selected_bespoke_attribute.name.toLowerCase()=='monogram'){
        if(!$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
          $scope.monogram_options = $scope.selected_bespoke_attribute.value;
          $scope.add_personalization_cost($scope.selected_bespoke_attribute.value['cost']);
        }
        else{
          $scope.remove_personalization_cost($scope.selected_bespoke_attribute.value['cost']);
          delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name];
        }
      }
      else{
        if(!$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
        }
        if($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]){
          $scope.remove_personalization_cost($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost']);
          delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name];
        }
        else{
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
          if(style_object.hasOwnProperty('fabric')){
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['fabric'] = '';
          }
          $scope.add_personalization_cost(style_object.cost);
        }

      }

    }
  };

  /*Bespoke attributes*/

  /*Load products*/
  $scope.search_products_url = CustomerConstants.api.products+'/searchByName?name_cont=';;

  $scope.select_contrast_product = function(product){
    console.log('selected contrast product', product, 'parent', this.$parent.$$childHead.id);
    var path = this.$parent.$$childHead.id.split('#');
    console.log('selected contrast product', path);
    $scope.cart_object[path[0]][path[1]][path[2]][path[3]] = product.title;
  };

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
    return false;
  };
  $scope.checkIsObject = function(style_value){
    console.log(style_value);
    console.log('style_value',angular.isArray(style_value));
    if(angular.isObject(style_value)){
      return true;
    }
    return false;
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





}])
.controller('ChooseStyleController', function($scope, $uibModalInstance, luxire_styles, active_style, parent_scope,ImageHandler, $timeout){
  console.log(luxire_styles);
  $scope.luxire_styles = luxire_styles;
  $scope.selectSliderIndex=-1;
  $scope.selected_style = active_style;
  $scope.hide_active_style_details = true;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
  $scope.active_detail_style = {};
  $scope.toggle_detailed_style = function(style, toggle){
    console.log('show style', style);
    $scope.hide_active_style_details = toggle;
    $scope.active_detail_style = !toggle ? style : {};
    console.log('active detail style', $scope.active_detail_style);
  };
  $(document).ready(function(){
      $timeout(function () {
        var slides_to_scroll = 5;
        $('.slick-bespoke-style-slider').slick({
          infinite: false,
          mobileFirst: true,
          slidesToShow: slides_to_scroll,
          slidesToScroll: 1
          // ,
          // prevArrow: $('#prev-style'),
          // nextArrow: $('#next-style')
        });
        function fetch_slick(key){
          var slick = $('.slick-bespoke-style-slider').slick('getSlick');
          if(key){
            return slick[key];
          }
          else{
            return slick;
          }
        }
        $('#prev-style').addClass('slick-arrow');
        $('#next-style').addClass('slick-arrow');
        var slick = fetch_slick();
        var slide_count = fetch_slick('slideCount');
        if(slide_count>slides_to_scroll){
          $('#prev-style').addClass('slick-disabled');
        }
        else{
          $('#prev-style').addClass('slick-disabled');
          $('#next-style').addClass('slick-disabled');
        }
        $('#next-style').click(function(){
          var slick= fetch_slick();
          if((slick.currentSlide+slides_to_scroll-1)<(slide_count-1)){
            $('.slick-bespoke-style-slider').slick('slickNext');
            $('#prev-style').removeClass('slick-disabled');
            slick= fetch_slick();
          }
          if((slick.currentSlide+slides_to_scroll-1)===(slide_count-1)){
            $('#next-style').addClass('slick-disabled');
          }
        });
        $('#prev-style').click(function(){
          var slick= fetch_slick();
          if(slick.currentSlide>0){
            $('.slick-bespoke-style-slider').slick('slickPrev');
            $('#next-style').removeClass('slick-disabled');
            slick= fetch_slick();
          }
          if(slick.currentSlide==0){
            $('#prev-style').addClass('slick-disabled');
          }
        });
      }, 0);
  });

  $scope.selectSlider=function(index, selected_style){
    console.log("index: "+index);
    $scope.selectSliderIndex=index;
    $scope.selected_style = selected_style;
  };
  $scope.select_style = function(index, style){
    console.log("index: "+index);
    console.log('style', style);
    if($scope.selected_style.name === style.name){
      $scope.selected_style = {};
      parent_scope.style_extractor(style, false);
    }
    else{
      $scope.selected_style = style;
      parent_scope.style_extractor(style, true);
    };
  };
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
  // $scope.select_style=function(index, style){
  //   console.log("index: "+index);
  //   console.log('style', style);
  //   if($scope.selected_style.name === style.name){
  //     $scope.selected_style = {};
  //     $scope.selected_style.is_selected = false;
  //   }
  //   else{
  //     $scope.selected_style = style;
  //     $scope.selected_style.is_selected = true;
  //   };
  // };
  //
  //
  // $scope.done = function(){
  //   $scope.selected_style.has_style_changed = false;
  //   if(active_style.name!==$scope.selected_style.name){
  //     $scope.selected_style.has_style_changed = true;
  //   }
  //   $uibModalInstance.close($scope.selected_style);
  // };




})
.controller('BespokeStyleController', function($scope, $uibModalInstance, ImageHandler, product, cart_object, parent_scope, active_style, $state, CustomerConstants, $filter, $timeout, $uibPosition){
  $scope.product = product;
  $scope.product['bespoke_attributes'] = product['customization_attributes'].concat(product['personalization_attributes']);
  $scope.product['bespoke_attributes'] = $filter('orderBy')($scope.product['bespoke_attributes'], 'id');
  $scope.product['customization_attributes'] = $filter('orderBy')($scope.product['customization_attributes'], 'id');
  $scope.active_style = active_style;
  $scope.cart_object = cart_object;
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };


  /*Slick wheeler/slider*/
  $(document).ready(function(){
      $timeout(function () {
        var slides_to_scroll = 6;
        $('.slick-bespoke-style-slider').slick({
          infinite: false,
          mobileFirst: true,
          slidesToShow: slides_to_scroll,
          slidesToScroll: 1,
          centerPadding: '2%'
        });
        var attr_to_show = 4;
        $('.bespoke-attributes-slider').slick({
          infinite: false,
          slidesToShow: attr_to_show,
          slidesToScroll: 1,
          centerPadding: '2%',
          vertical: true
        });
        $('#prev-style').addClass('slick-arrow');
        $('#next-style').addClass('slick-arrow');
        function fetch_slick(key){
          var slick = $('.slick-bespoke-style-slider').slick('getSlick');
          if(key){
            return slick[key];
          }
          else{
            return slick;
          }
        }
        var slide_count = fetch_slick('slideCount');
        if(slide_count>slides_to_scroll){
          $('#prev-style').addClass('slick-disabled');
        }
        else{
          $('#prev-style').addClass('slick-hidden');
          $('#next-style').addClass('slick-hidden');
        }
        $('#next-style').click(function(){
          var slick= fetch_slick();
          if((slick.currentSlide+slides_to_scroll-1)<(slide_count-1)){
            $('.slick-bespoke-style-slider').slick('slickNext');
            $('#prev-style').removeClass('slick-disabled');
            slick= fetch_slick();
          }
          if((slick.currentSlide+slides_to_scroll-1)===(slide_count-1)){
            $('#next-style').addClass('slick-disabled');
          }
        });
        $('#prev-style').click(function(){
          var slick= fetch_slick();
          if(slick.currentSlide>0){
            $('.slick-bespoke-style-slider').slick('slickPrev');
            $('#next-style').removeClass('slick-disabled');
            slick= fetch_slick();
          }
          if(slick.currentSlide==0){
            $('#prev-style').addClass('slick-disabled');
          }
        });

        $('#prev-attr').addClass('slick-arrow');
        $('#next-attr').addClass('slick-arrow');
        function fetch_slick_attrs(key){
          var slick = $('.bespoke-attributes-slider').slick('getSlick');
          if(key){
            return slick[key];
          }
          else{
            return slick;
          }
        }
        var attr_count = fetch_slick_attrs('slideCount');
        if(attr_count>attr_to_show){
          $('#prev-attr').addClass('slick-disabled');
        }
        else{
          $('#prev-attr').addClass('slick-hidden');
          $('#next-attr').addClass('slick-hidden');
        }
        $('#next-attr').click(function(){
          var slick= fetch_slick_attrs();
          if((slick.currentSlide+attr_to_show-1)<(attr_count-1)){
            $('.bespoke-attributes-slider').slick('slickNext');
            $('#prev-attr').removeClass('slick-disabled');
            slick= fetch_slick_attrs();
          }
          if((slick.currentSlide+attr_to_show-1)===(attr_count-1)){
            $('#next-attr').addClass('slick-disabled');
          }
        });
        var prev_attr_init = true;
        $('#prev-attr').click(function(){
          var slick= fetch_slick_attrs();
          if(slick.currentSlide>0){
            $('.bespoke-attributes-slider').slick('slickPrev');
            $('#next-attr').removeClass('slick-disabled');
            slick= fetch_slick_attrs();
          }
          if(slick.currentSlide==0){
            $('#prev-attr').addClass('slick-disabled');
          }
        });
        $('#next-attr').click();

        $('#prev-attr').click();


        $scope.activate_bespoke_attribute($scope.product['bespoke_attributes'][0]);
        // $('.bespoke-attributes-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        //   console.log('n', nextSlide);
        //   $scope.activate_bespoke_attribute($scope.product['bespoke_attributes'][nextSlide]);
        //   $scope.$digest();
        // });
      }, 0);
  });


  /*Slick wheeler/slider*/

  $scope.more_details = function(attr_name, attr_type){
    attr_name = attr_name.toLowerCase().replace(" ","-");
    attr_type = attr_type.toLowerCase().replace(" ","-");
    window.open('/#/attributes/'+attr_name+'?type='+attr_type, '_blank')
  };

  $scope.attr_options_key_length = function(options_obj){
    if(options_obj && angular.isObject(options_obj)){
      return Object.keys(options_obj).length;
    }
    else{
      return 0;
    }
  };

  $scope.view_measurements = {
    templateUrl: 'view_measurements_popover.html'
  };

  $scope.enlarge_style = function(style, element){
    $scope.enlarge_image_xpos = element.clientX-360;
    $scope.enlarge_image_ypos = element.clientY-30;
    $scope.enlarged_style = style;

  };

  $scope.upload_custom_image = function(files, index){
    console.log('attr image', files[0]);
    console.log('index', index);
    if (files && files.length) {
      console.log('custom image');
      ImageHandler.custom_image_upload(files[0])
      .then(function(data){
        $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'][index].url = data.data.image;
        console.log(data);
      }, function(error){
        console.error(error);
      });
    }
  }

  /*Add custom images*/
  $scope.add_custom_image = function(){
    console.log('add custom images');
    if(!$scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
     || ($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']
     && !angular.isArray($scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images']))){
       $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'] = [];
     }
     $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].push({
       url: '',
       notes: ''
     });
  };

  $scope.delete_custom_image = function(index){
    $scope.cart_object['customization_attributes'][$scope.selected_bespoke_attribute.name]['options']['custom_images'].splice(index, 1);
  };

  /*Check whether to display in view r not*/
  $scope.check_unpermitted_customization_params = function(attribute, key){
    var unpermitted_params_non_custom = ['image','url','help','help_url', 'help_image', 'cost'];
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
    console.log('dismiss');
    $uibModalInstance.dismiss('cancel');
  };

  $scope.next_step = function(){
    console.log('closing bespoke cart_object', $scope.cart_object);
    console.log('closing bespoke style', $scope.active_style);
    $uibModalInstance.close({
      cart_object: $scope.cart_object,
      active_style: $scope.active_style
    });
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


  /*Bespoke attributes*/
  $scope.activate_bespoke_attribute = function(bespoke_attribute){
    $scope.selected_bespoke_attribute = bespoke_attribute;
    console.log('selected_bespoke_attribute', bespoke_attribute);
  };
  var obj_keys = [];
  //activate and deactivate a bespoke style
  $scope.activate_bespoke_style = function(attr_type, style_object, index, style_name){

    if(attr_type == 'customize'){
      if($scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value']==style_name){
        if(style_object.cost){
          $scope.remove_personalization_cost(style_object.cost);
          delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name];
        }
         $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] = '';
         $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
         delete $scope["customization_attributes"][$scope.selected_bespoke_attribute.name];
     }
     else{
       if(style_object.cost){
         if($scope.cart_object["personalization_attributes"] && !$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
           $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]= {};
         }
         if($scope.cart_object["personalization_attributes"] && $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
           obj_keys = Object.keys($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]);
           if(obj_keys.length){
             $scope.remove_personalization_cost($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][obj_keys[0]]['cost']);
             delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][obj_keys[0]];
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
             $scope.add_personalization_cost(style_object.cost);
           }
           else{
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
             $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
             $scope.add_personalization_cost(style_object.cost);
           }
         }
       }
       $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'] = style_name;
       if(!angular.isObject($scope["customization_attributes"])){
         $scope["customization_attributes"] = {};
       };
       if(angular.isObject($scope["customization_attributes"]) && !angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name])){
         $scope["customization_attributes"][$scope.selected_bespoke_attribute.name] = {};
       };
       if(angular.isObject($scope["customization_attributes"]) && angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name]) && !angular.isObject($scope["customization_attributes"][$scope.selected_bespoke_attribute.name]["options"])){
         $scope["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = {};
       }
       console.log($scope["customization_attributes"]);
       console.log('style_object', style_object);

       angular.forEach(style_object, function(val, key){
         console.log('style_object key', key );
         if($scope.check_unpermitted_customization_params($scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['value'], key)){
           /*Change 15 March 2015 to set default*/
           $scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'][key] = angular.isObject(style_object[key])? style_object[key].default : style_object[key];
           console.log('attr for order_sheet',$scope.cart_object["customization_attributes"][$scope.selected_bespoke_attribute.name]['options']);
         }
       });
       $scope["customization_attributes"][$scope.selected_bespoke_attribute.name]['options'] = style_object;
     }
    }
    else if(attr_type == 'personalize'){
      console.log('style obj', style_object);
      console.log('style name', style_name);
      console.log('personalize', $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]);
      if($scope.selected_bespoke_attribute.name.toLowerCase()=='monogram'){
        if(!$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
          $scope.monogram_options = $scope.selected_bespoke_attribute.value;
          $scope.add_personalization_cost($scope.selected_bespoke_attribute.value['cost']);
        }
        else{
          $scope.remove_personalization_cost($scope.selected_bespoke_attribute.value['cost']);
          delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name];
        }
      }
      else{
        if(!$scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name]){
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name] = {};
        }
        if($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]){
          $scope.remove_personalization_cost($scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost']);
          delete $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name];
        }
        else{
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name] = {};
          $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['cost'] = style_object.cost;
          if(style_object.hasOwnProperty('fabric')){
            $scope.cart_object["personalization_attributes"][$scope.selected_bespoke_attribute.name][style_name]['fabric'] = '';
          }
          $scope.add_personalization_cost(style_object.cost);
        }

      }

    }
  };

  /*Bespoke attributes*/

  /*Load products*/
  $scope.search_products_url = CustomerConstants.api.products+'/searchByName?name_cont=';;

  $scope.select_contrast_product = function(product){
    console.log('selected contrast product', product, 'parent', this.$parent.$$childHead.id);
    var path = this.$parent.$$childHead.id.split('#');
    console.log('selected contrast product', path);
    $scope.cart_object[path[0]][path[1]][path[2]][path[3]] = product.title;
  };

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
    $scope.select_style = function(index, style){
      console.log("index: "+index);
      console.log('style', style);
      if($scope.active_style.name == style.name){
        parent_scope.style_extractor(style, false);
        $scope.active_style = {};

      }
      else{
        $scope.active_style = style;
        parent_scope.style_extractor(style, true);
      };
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

.controller('SummaryController', ['$scope', 'product','cart_object', 'base_style', '$uibModalInstance',function($scope, product, cart_object, base_style, $uibModalInstance){
  $scope.product = product;
  $scope.cart_object = cart_object;
  $scope.base_style = base_style;
  console.log('cart_object in summary', cart_object);
  $scope.summary_bespoke_attributes = cart_object['customization_attributes'];
  angular.forEach(cart_object['personalization_attributes'], function(val, key){
    $scope.summary_bespoke_attributes[key] = val;
  });
  $scope.total_customizable_attributes = [];
  console.log('cart object', cart_object);
  console.log('bespoke attributes', $scope.summary_bespoke_attributes);
  angular.forEach($scope.summary_bespoke_attributes, function(val, key){
    console.log('printing attr for summary', 'key',key,'val',val);
    if(val.value&&val.options && val.value!==''){
      $scope.total_customizable_attributes.push({name: key,value:val.value,options: val.options});
    }
    else if((val.value&&val.options && val.value=='') || (!val.value&&!val.options) ){//for personalisation
      console.log('Personalization keys', key);
      if(key.toLowerCase()!=='monogram'){
        angular.forEach(val,function(v, k){
          $scope.total_customizable_attributes.push({name: key,value:k,options: v,cost: v.cost});
        })
      }
      else{
        console.log('Personalization keys Monogram');
        $scope.total_customizable_attributes.push({name: key,value:'Monogram',options: val,cost: val.cost});
      }

    }
  });
  $scope.view_measurements = {
    templateUrl: 'view_measurements_popover.html'
  };
  $scope.attr_options_key_length = function(options_obj){
    if(options_obj && angular.isObject(options_obj)){
      return Object.keys(options_obj).length;
    }
    else{
      return 0;
    }
  };
  $scope.std_attrs_length = 0;
  $scope.body_attrs_length = 0;
  $scope.filter_attr = function(type, attrs){
    angular.forEach(attrs, function(val, key){
      if(!attrs[key]){
        delete attrs[key];
      }
    })
    $scope[type+'_length'] = Object.keys(attrs).length;
    return attrs;
  }

  $scope.close = function(){
    $uibModalInstance.dismiss('cancel');
  };



}])
.controller('EnlargedProductImageController',['$scope', 'product', '$uibModalInstance', 'ImageHandler', function($scope, product, $uibModalInstance, ImageHandler){
  console.log('enlarged product image ctrl', product);
  $scope.product = product;
  $scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  };
  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };
}])
// .factory('uiSliderConfig', function ($log) {
//     this.sliderStartValue = 0;
//     this.sliderStopValue = 0;
//     var self = this;
//     return {
//         start: function (event, ui) {
//             // $log.info('Slider start',event,ui); self.sliderStartValue = ui.value;
//         },
//         stop: function (event, ui) {
//             // $log.info('Slider stop',event,ui); $log.error('Note - end value = ',self.sliderStopValue);
//         }
//     };
// })
// .factory('colorpicker', function() {
//     function hexFromRGB(r, g, b) {
//         var hex = [r.toString(16), g.toString(16), b.toString(16)];
//         angular.forEach(hex, function(value, key) {
//             if (value.length === 1)
//                 hex[key] = "0" + value;
//         });
//         return hex.join('').toUpperCase();
//     }
//     return {
//         refreshSwatch: function(r, g, b) {
//             var color = '#' + hexFromRGB(r, g, b);
//             angular.element('#swatch').css('background-color', color);
//         }
//     };
// })
//  /*Measurement Slider*/
//   // $scope.uMin = 1;
//   // $scope.uMax = 19;
//   // $scope.lMin = 1;
//   // $scope.lMax = 34
//   load_measurement_scales  = function(product){
//     $scope.$watch('Tracker.upper', function(newVal, oldVal){
//       console.log('upper slider new value', newVal);
//         refreshUpperMeasure(newVal);
//     })
//     $scope.$watch('Tracker.lower', function(newVal, oldVal){
//         refreshLowerMeasure(newVal);
//     })
//     if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'shirts'){

//       $scope.uCounters = [12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19];
//       $scope.uCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
//       $scope.uCountersMap = [11.75,12,12.25,12.5,12.75,13,13.25,13.5,13.75,14,14.25,14.5,14.75,15,15.25,15.5,15.75,16,16.25,16.5,16.75,17,17.25,17.5,17.75,18,18.25,18.5,18.75];
//       $scope.lCounters = [20,21,22,23,24,25,26,27,28,29,30,31,32,33,34];
//       $scope.lCountersMap = [19.5,20,20.5,21,21.5,22,22.5,23,23.5,24,24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,31.5,32,32.5,33,33.5,34];
//       $scope.lCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];

//     }
//     else if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'pants'){
//       $scope.uCounters =    [25,26,27,28,29,30,31,32,33,34,35,36,37,38];
//       $scope.uCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
//       $scope.uCountersMap = [24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38];
//       $scope.lCounters =   [35,36,37,38,39,40,41,42,43,44,45,46,47,48];
//       $scope.lCountersMap = [34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,45,45.5,46,46.5,47,47.5,48];
//       $scope.lCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];

//     }
//     else if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'jackets'){
//       $scope.uCounters =    [25,26,27,28,29,30,31,32,33,34,35,36,37,38];
//       $scope.uCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
//       $scope.uCountersMap = [24.5,25,25.5,26,26.5,27,27.5,28,28.5,29,29.5,30,30.5,31,32,32.5,33,33.5,34,34.5,35,35.5,36,36.5,37,37.5,38];
//       $scope.lCounters =   [35,36,37,38,39,40,41,42,43,44,45,46,47,48];
//       $scope.lCountersMap = [34.5,35,35.5,36,36.5,37,37.5,38,38.5,39,39.5,40,40.5,41,41.5,42,42.5,43,43.5,44,44.5,45,45.5,46,46.5,47,47.5,48];
//       $scope.lCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];

//     }
//   }
//   // Counter/Stepper for upper slider
//   // $scope.uCounters = [12,12.5,13,13.5,14,14.5,15,15.5,16,16.5,17,17.5,18,18.5,19];
//   // $scope.uCountersInt = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
//   // $scope.uCountersMap = [12,12.25,12.5,12.75,13,13.25,13.5,13.75,14,14.25,14.5,14.75,15,15.25,15.5,15.75,16,16.25,16.5,16.75,17,17.25,17.5,17.75,18,18.25,18.5,18.75,19];

//   // Counter/Stepper for lower slider
//     // Initial Values

//   $scope.Tracker = {
//       upper: 0,
//       lower: 0
//   }
//   $scope.Tracker.upper = $scope.uMin;
//   $scope.Tracker.lower = $scope.lMin;
//   //Track values as they change
//   $scope.newUpperMeasurement = $scope.uMin;
//   $scope.newLowerMeasurement = $scope.lMin;
//   //left margin property for upper and lower slider handles
//   $scope.uSliderHandleLeftMargin = '0px';
//   $scope.lSliderHandleLeftMargin = '0px';

//   //Vertical alignment
//   $scope.uTopDisplacement = -75+'px';
//   $scope.lBottomDisplacement = 33+'px';

//   $scope.getAlert = {
//       start: uiSliderConfig.start,
//       stop: uiSliderConfig.stop
//   }
//   /**
//    * Process Upper Slider tracking and view updates
//    * */


//   function refreshUpperMeasure(newValue) {
//       var location = $scope.uCountersInt.indexOf(newValue);
//       $scope.newUpperMeasurement = $scope.uCountersMap[location];
//       var product = $scope.product;
//       if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'shirts'){
//         $scope.cart_object['standard_measurement_attributes']['Collar Size']['value'] = $scope.newUpperMeasurement;
//       }
//       else if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'pants'){
//         $scope.cart_object['standard_measurement_attributes']['Waist Size']['value'] = $scope.newUpperMeasurement;
//       }
//       else if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'jackets'){
//         $scope.cart_object['standard_measurement_attributes']['Chest Size']['value'] = $scope.newUpperMeasurement;
//       }


//   }
//   //get the upper ui-slider-handle position every 10ms and update the upper sticker position
//   // $interval(function(){
//   //     $scope.uSliderHandleLeftMargin = getPosition(document.querySelector('div.upper-slider > span.ui-slider-handle')).x -99 -33 -36 + 'px';
//   // },10)

//   $scope.getUpperValue = function() {
//       return $scope.newUpperMeasurement
//   }
//   /**
//    * Process Lower Slider tracking and view updates
//    * */



//   function refreshLowerMeasure(newValue) {
//       var location = $scope.uCountersInt.indexOf(newValue);
//       $scope.newLowerMeasurement = $scope.lCountersMap[location];
//       var product = $scope.product;

//       if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'shirts'){
//         $scope.cart_object['standard_measurement_attributes']['Sleeve Length']['value'] = $scope.newLowerMeasurement;
//       }
//       else if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'pants'){
//         $scope.cart_object['standard_measurement_attributes']['In-seam']['value'] = $scope.newLowerMeasurement;
//       }
//       else if(product && product.product_type && product.product_type.product_type && product.product_type.product_type.toLowerCase() === 'jackets'){
//         $scope.cart_object['standard_measurement_attributes']['Length']['value'] = $scope.newLowerMeasurement;
//       }

//   }
//   //get the upper ui-slider-handle position every 10ms and update the upper sticker position
//   // $interval(function(){
//   //     $scope.lSliderHandleLeftMargin = getPosition(document.querySelector('div.lower-slider > span.ui-slider-handle')).x -99 -33 -36 + 'px';
//   // },10)

//   $scope.getLowerValue = function() {
//       return $scope.newLowerMeasurement
//   }
//   /**
//    * Utility Functions
//    * */
//   function getPosition(el) {
//       var xPos = 0;
//       var yPos = 0;

//       while (el) {
//           console.log('EL is: ', el);
//           if (el.tagName == "BODY") {
//               // deal with browser quirks with body/window/document and page scroll
//               var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
//               var yScroll = el.scrollTop || document.documentElement.scrollTop;

//               xPos += (el.offsetLeft - xScroll + el.clientLeft);
//               yPos += (el.offsetTop - yScroll + el.clientTop);
//           } else {
//               console.log('In ELSE')
//               // for all other non-BODY elements
//               xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
//               yPos += (el.offsetTop - el.scrollTop + el.clientTop);
//               console.log('XPos: ',xPos,'YPos: ',yPos)
//           }

//           el = el.offsetParent;
//       }
//       return {
//           x: xPos,
//           y: yPos
//       };
//   }
//   /**
//    * Following functions came with the example - delete after testing
//    * */
//   function refreshSwatch(ev, ui) {
//       var red = $scope.colorpicker.red,
//               green = $scope.colorpicker.green,
//               blue = $scope.colorpicker.blue;
//       colorpicker.refreshSwatch(red, green, blue);
//   }

//   this.slider = {
//       options: {
//           start: function(event, ui){
//               $log.info('Event: Slider start - set with slider options', event);
//           },
//           stop: function(event, ui){
//               $log.info('Event: Slider stop - set with slider options', event);
//           }
//       }
//   }
//   this.colorpicker = {
//       red: 255,
//       green: 140,
//       blue: 60,
//       options: {
//           orientation: 'horizontal',
//           min: 0,
//           max: 255,
//           range: 'min',
//           change: refreshSwatch,
//           slide: refreshSwatch
//       }
//   };
