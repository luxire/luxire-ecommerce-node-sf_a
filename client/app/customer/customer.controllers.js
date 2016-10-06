angular.module('luxire')
/*Client ctrl instead of customer ctrl is used to
avoid conflict with customer ctrl on admin side*/
.controller('ClientController',function($scope, $rootScope, $state, CustomerOrders, $aside, $timeout, CustomerProducts, CustomerConstants, $location, CustomerAuthentication, CustomerUtils){
  var prev_state = '';
  $scope.show_header = true;
  $scope.checkout_state = false;
  $scope.is_customer_home_state = false;

  $scope.header_visibility = function(state){
    console.log('current state', state);
    if(state.name!==prev_state){
      if(state.name === "customer.home"){
        $scope.is_customer_home_state = true;
      }
      else{
        $scope.is_customer_home_state = false;
      }

      if(state.name.indexOf('checkout') !==-1){
        console.log('hide header');
        $scope.show_header = false;
        $scope.checkout_state = true;
      }
      else if(state.name.indexOf('attribute_detail') !==-1){
        $scope.show_header = false;
        $scope.checkout_state = false;
      }
      else{
        console.log(' not a checkout state');
        $scope.show_header = true;
        $scope.checkout_state = false;
      }
      prev_state = state.name;
    }


  }
  function reset_login_status(){
    $scope.isLoggedIn = CustomerAuthentication.isLoggedIn();
    $scope.user_name = $scope.isLoggedIn ? CustomerAuthentication.identity() : '';
  };
  reset_login_status();
  $scope.header_visibility($state.current);

  $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    $scope.header_visibility(toState);
    reset_login_status();
    console.log('changing state', toState);
  })

  $scope.changeHeader = function(){
      $scope.show_header = true;
      $scope.is_window_scrolled = true;
      $(".customer-main-nav-header").addClass('changed-customer-home-header-color');
  };

  $timeout(function(){

    $(window).scroll(function(){

      //$("#customer-main-nav-header").height()
      // $(window).scrollTop()>$("#customer-main-nav-header").height()
      if($(window).scrollTop()>0){
        if($scope.is_customer_home_state){
          // $scope.changeHeader();
            // $(".customer-main-nav-header").addClass('changed-customer-home-header-color');
        }
        else{
            $scope.is_window_scrolled = true;

            if($(".changed-customer-home-header-color").length){
              $(".customer-main-nav-header").removeClass('changed-customer-home-header-color');
            }
            $(".customer-main-nav-header").addClass('changed-customer-header-color');
        }
      }
      else{
        $scope.is_window_scrolled = false;
        if($scope.is_customer_home_state){
          $timeout(function(){
            $(".customer-main-nav-header").removeClass('changed-customer-home-header-color');
          })

        }
        else{
          $timeout(function(){
            $(".customer-main-nav-header").removeClass('changed-customer-header-color');
          })

        }
      }
    })

  }, 0);
  $scope.arrow_margin_left = 0;



  /*Tool tip for taxonomy */
  $scope.change_arrow_pos = function(event){
    $scope.arrow_margin_left = $(event.currentTarget).offset().left + ($(event.currentTarget).width()/2);
  };

  CustomerProducts.taxonomy_index()
  .then(function(data){
    console.log('taxonomies', data);
    $scope.taxonomies = data.data.taxonomies;
  }, function(error){
    console.error(error);
  });

  $scope.setFocusOnSearch = function(val){
    if(val){
      $("#products_search").focus();
    }
  };

  $scope.go_to_collection = function(event, permalink){
    console.log('permalink', permalink);
    event.preventDefault();
    $location.url('/collections/'+permalink);
  };

  /*Load products*/
  // $scope.search_products_url = CustomerConstants.api.products+'?q[name_cont]=';//search provided by ransack
  $scope.search_products_url = CustomerConstants.api.products+'/searchByName?name_cont=';


  /*Select product from search*/
  $scope.select_product = function(data){
    $scope.show_search_panel = false;
    console.log('selected product', data);
    $state.go('customer.product_detail', {
      product_name: data.originalObject.slug
    });
  };


  $scope.go_to_login = function(){
    $state.go('customer.login');
  };

  $scope.go_to_signup = function(){
    $state.go('customer.signup');
  };

  $scope.logout = function(){
    CustomerAuthentication.logout();
    $rootScope.luxire_cart = [];
    $rootScope.alerts.push({type: 'success', message: 'Successfully logged out'});
    $state.go('customer.home');
    CustomerOrders.get_order_by_cookie()
    .then(function(data){
      console.log('fetched order', data.data);
      $rootScope.luxire_cart = data.data;
    },
    function(error){
      $rootScope.luxire_cart = [];
      console.error(error);
    });
    reset_login_status();

  };

  $scope.go_to_my_account = function(){
    $state.go('customer.my_account');
  };

  $scope.open_side_menu = function(){
    console.log('opening side menu');
    var asideInstance = $aside.open({
      templateUrl: 'customer_side_menu.html',
      controller: 'CustomerSideMenuController',
      placement: 'right',
      size: 'sm',
      backdrop: 'true',
      windowClass: 'side-menu',
      backdropClass: 'sideMenuBackdrop',
      resolve: {
        taxonomies: function(){
          return $scope.taxonomies;
        }
      }
    });

    asideInstance.result
    .then(function(selection){
      console.log(selection);
      $state.go('customer.product_listing',selection);

    }, function(){
      console.log('side menu dismissed');
    });
  };

  CustomerOrders.get_order_by_cookie().then(function(data){
    console.log('data from cookie', data);
    if(data.data === "null"){
      console.log("No order found");
      $rootScope.luxire_cart = {};
      $rootScope.$broadcast('fetched_order_from_cookie', data);
    }
    else{
      console.log('cart status', $rootScope.luxire_cart);
      $rootScope.$broadcast('fetched_order_from_cookie', data);
      $rootScope.luxire_cart = data.data;
    }
    if($rootScope.luxire_cart && $rootScope.luxire_cart.currency){
      CustomerUtils.set_local_currency_in_app($rootScope.luxire_cart.currency);
      $scope.selected_currency = $scope.currencies[$rootScope.luxire_cart.currency];
      $rootScope.$broadcast('currency_change', $scope.selected_currency.symbol);
    }
    else{
      CustomerUtils.get_local_currency().then(function(data){
        console.log('currency', data);
        CustomerUtils.set_local_currency_in_app(data.data);
        if(data.data && $scope.currencies.hasOwnProperty(data.data)){
          $scope.selected_currency = $scope.currencies[data.data];
        }
        else{
          $scope.selected_currency = $scope.currencies["USD"];
        }
        $rootScope.$broadcast('currency_change', data.data);
      }, function(error){
        console.log('error', error)
        $scope.selected_currency = $scope.currencies["USD"];
      });
    }

    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items &&$rootScope.luxire_cart.line_items.length){
      if($rootScope.luxire_cart.line_items[0].luxire_line_item.measurement_unit.toLowerCase() == "in"){
        $scope.selected_measurement_unit = $scope.measurement_units[0];
      }
      else if($rootScope.luxire_cart.line_items[0].luxire_line_item.measurement_unit.toLowerCase() == "cm"){
        $scope.selected_measurement_unit = $scope.measurement_units[1];
      }
    }
    else{
      $scope.selected_measurement_unit = $scope.measurement_units[0];
    }

  }, function(error){
    console.error('data from cookie', error);
    $rootScope.$broadcast('fetched_order_from_cookie', error);
    CustomerUtils.get_local_currency().then(function(data){
        console.log('currency', data);
        CustomerUtils.set_local_currency_in_app(data.data);
        if(data.data && $scope.currencies.hasOwnProperty(data.data)){
          $scope.selected_currency = $scope.currencies[data.data];
        }
        else{
          $scope.selected_currency = $scope.currencies["USD"];
        }
        $rootScope.$broadcast('currency_change', data.data);
      }, function(error){
        console.log('error', error)
        $scope.selected_currency = $scope.currencies["USD"];
      });
  });
  $rootScope.luxire_cart = angular.isUndefined($rootScope.luxire_cart)? {} : $rootScope.luxire_cart;

  /*Bread crumbs */
  $scope.checkout_steps = {
    'address': {
      id: 0,
      name: 'ADDRESS',
    },
    'delivery': {
      id: 1,
      name: 'DELIVERY'
    },
    'payment': {
      id: 2,
      name: 'PAYMENT'
    }
  };

  /*Measurement Unit*/
  $scope.measurement_units = [
    {
      id: 1,
      label: 'Inch',
      symbol: 'In'
    },
    {
      id: 2,
      label: 'Cm',
      symbol: 'cm'
    }
  ];

  if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items &&$rootScope.luxire_cart.line_items.length){
    if($rootScope.luxire_cart.line_items[0].luxire_line_item.measurement_unit.toLowerCase() == "in"){
      $scope.selected_measurement_unit = $scope.measurement_units[0];
    }
    else if($rootScope.luxire_cart.line_items[0].luxire_line_item.measurement_unit.toLowerCase() == "cm"){
      $scope.selected_measurement_unit = $scope.measurement_units[1];
    }
  }
  else{
    $scope.selected_measurement_unit = $scope.measurement_units[0];
  }


  var update_order_measurement_unit = function(unit){
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items.length){
      var luxire_line_items = [];
      for(var i=0;i<$rootScope.luxire_cart.line_items.length;i++){
        if(unit == "cm"){
          $rootScope.luxire_cart.line_items[i].luxire_line_item.customized_data = CustomerUtils.convert_in_to_cm($rootScope.luxire_cart.line_items[i].luxire_line_item.customized_data);
          $rootScope.luxire_cart.line_items[i].luxire_line_item.measurement_data = CustomerUtils.convert_in_to_cm($rootScope.luxire_cart.line_items[i].luxire_line_item.measurement_data);
          $rootScope.luxire_cart.line_items[i].luxire_line_item.personalize_data = CustomerUtils.convert_in_to_cm($rootScope.luxire_cart.line_items[i].luxire_line_item.personalize_data);
          $rootScope.luxire_cart.line_items[i].luxire_line_item.measurement_unit = "cm";
        }
        else if(unit == "in"){
          $rootScope.luxire_cart.line_items[i].luxire_line_item.customized_data = CustomerUtils.convert_cm_to_in($rootScope.luxire_cart.line_items[i].luxire_line_item.customized_data);
          $rootScope.luxire_cart.line_items[i].luxire_line_item.measurement_data = CustomerUtils.convert_cm_to_in($rootScope.luxire_cart.line_items[i].luxire_line_item.measurement_data);
          $rootScope.luxire_cart.line_items[i].luxire_line_item.personalize_data = CustomerUtils.convert_cm_to_in($rootScope.luxire_cart.line_items[i].luxire_line_item.personalize_data);
          $rootScope.luxire_cart.line_items[i].luxire_line_item.measurement_unit = "in";
        }
        luxire_line_items.push($rootScope.luxire_cart.line_items[i].luxire_line_item);
      };
      CustomerOrders.updated_order_measurement_unit($rootScope.luxire_cart, luxire_line_items)
      .then(function(data){
        console.log('data', data.data);
        $rootScope.luxire_cart = data.data;
        $scope.loading = false;
      }, function(error){
        console.log('error', error.data);
        $scope.loading = false;

      });

    }
  };

  $scope.change_measurement_unit = function(measurement_unit){
    $scope.loading = true;
    $scope.selected_measurement_unit = measurement_unit;
    console.log('selected unit', measurement_unit);
    update_order_measurement_unit(measurement_unit.symbol.toLowerCase());
    $rootScope.$broadcast('measurement_unit_change', measurement_unit);
  };

  /*Multi Currency */
  $scope.currencies = {
    "USD": {
      id: 1,
      label: "US Dollar",
      symbol: "USD"
    },
    "EUR": {
      id: 2,
      label: "EURO",
      symbol: "EUR"
    },
    "AUD": {
      id: 3,
      label: "Australian Dollar",
      symbol: "AUD"
    },
    "SGD": {
      id: 4,
      label: "Singapore Dollar",
      symbol: "SGD"
    },
    "NOK": {
      id: 5,
      label: "Norway Krone",
      symbol: "NOK"
    },
    "DKK": {
      id: 6,
      label: "Danish Krone",
      symbol: "DKK"
    },
    "SEK": {
      id: 7,
      label: "Sweden Krona",
      symbol: "SEK"
    },
    "CHF": {
      id: 8,
      label: "Swiss Franc",
      symbol: "CHF"
    },
    "INR": {
      id: 9,
      label: "Indian Rupee",
      symbol: "INR"
    },
    "GBP": {
      id: 10,
      label: "British Pound",
      symbol: "GBP"
    },
    "CAD": {
      id: 11,
      label: "Canadian Dollar",
      symbol: "CAD"
    }

  };






  $scope.change_currency = function(currency){
    $scope.selected_currency = currency;
    console.log('selected currency', currency);
    CustomerUtils.set_local_currency_in_app(currency.symbol);
    $rootScope.$broadcast('currency_change', currency.symbol);
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items && $rootScope.luxire_cart.currency && $rootScope.luxire_cart.currency !== currency.symbol){
      $scope.loading = true;
      CustomerOrders.update_order_currency($rootScope.luxire_cart).then(function(data){
        console.log('success', data);
        $rootScope.luxire_cart = data.data;
        $scope.loading = false;
        $rootScope.$broadcast('fetched_order_from_cookie', data);
      }, function(error){
        console.log('error', error);
        $scope.loading = false;
      });
    }
  };

  $scope.go_to_checkout_state = function(state){
    if($rootScope.luxire_cart && $scope.checkout_steps[$rootScope.luxire_cart.state].id>state.id){
      $state.go("customer.checkout_"+state.name.toLowerCase());
    }
  };
})
.controller('CustomerSideMenuController', function($scope, $state, taxonomies,$rootScope, $uibModalInstance, CustomerAuthentication, $location, CustomerOrders){
  console.log('taxonomies', taxonomies);
  $scope.taxonomies = taxonomies;
  $scope.visible_taxonomy_permalink = taxonomies[0].root.permalink;

  $scope.go_to_collection = function(permalink){
    $location.url('/collections/'+permalink);
    $uibModalInstance.dismiss();
  };

  $scope.change_active_taxonomy = function(taxonomy){
    $scope.visible_taxonomy_permalink = taxonomy;
  };

  $scope.isLoggedIn = CustomerAuthentication.isLoggedIn();

  $scope.go_to_login = function(){
    $uibModalInstance.dismiss('cancel');
    $state.go('customer.login');
  }

  $scope.go_to_signup = function(){
    $uibModalInstance.dismiss('cancel');
    $state.go('customer.signup');

  }

  $scope.go_to_logout = function(){
    $uibModalInstance.dismiss('cancel');
    CustomerAuthentication.logout();
    $rootScope.luxire_cart = [];
    $rootScope.alerts.push({type: 'success', message: 'Successfully logged out'});
    $state.go('customer.home');
    CustomerOrders.get_order_by_cookie()
    .then(function(data){
      console.log('fetched order', data.data);
      $rootScope.luxire_cart = data.data;
    },
    function(error){
      $rootScope.luxire_cart = [];
      console.error(error);
    });

  }

  $scope.go_to_my_account = function(){
    $uibModalInstance.dismiss('cancel');
    $state.go('customer.my_account');
  };

  $scope.close_side_menu = function(){
    $uibModalInstance.dismiss();
  };

})
.controller('quickViewModalController',function($scope, $uibModalInstance, product, is_fabric_taxonomy, is_gift_card, selected_currency, CustomerOrders, $state, ImageHandler, CustomerProducts, $rootScope){
  console.log('product', product);
  $scope.loading_product = true;
  console.log('is fabric', is_fabric_taxonomy);
  $scope.fabric_taxonomy = is_fabric_taxonomy;
  $scope.is_gift_card = is_gift_card;
  $scope.selected_currency = selected_currency;

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


  var thickness = 0;
  /*Get Thickness icon*/
  $scope.thickness_index = function(variant_thickness){
    thickness = parseInt(variant_thickness.split('.')[1].split('mm')[0]);
    if(thickness/10 >5){
      return 6;
    }
    else {
      return Math.ceil(thickness/10);
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


  $scope.getImage = function(url){
    console.log('url', url);
    return ImageHandler.url(url);
  }

  /*Need to make changes to rabl*/
  /*Functionality for add to cart from quick view*/
  if(is_fabric_taxonomy){
    $scope.quickViewProduct = product;
    $scope.loading_product = false;
  }
  else{
    CustomerProducts.show(product.id)
    .then(function(data){
      console.log('Non fabric product', data.data);
      $scope.loading_product = false;
      $scope.quickViewProduct = data.data;
      json_array_to_obj("customization_attributes", $scope.quickViewProduct.customization_attributes);
      json_array_to_obj("personalization_attributes", $scope.quickViewProduct.personalization_attributes);
      json_array_to_obj("standard_measurement_attributes", $scope.quickViewProduct.standard_measurement_attributes);
      json_array_to_obj("body_measurement_attributes", $scope.quickViewProduct.body_measurement_attributes);

      if($scope.quickViewProduct.product_type.product_type.toLowerCase() === 'gift cards'){
        $scope.selected_gift_card_variant = $scope.quickViewProduct.master;
        $scope.quickViewProduct.variants.push($scope.quickViewProduct.master);
        console.log('selected gift card variant', $scope.selected_gift_card_variant);
      }

    }, function(error){
      $scope.loading_product = false;
      console.error('error fetching product', error);
    });
  }
  $scope.cart_object = {};

  $scope.add_to_cart = function(variant){
    console.log('add to cart', variant);
    console.log('luxire_cart', $rootScope.luxire_cart);
    if($rootScope.luxire_cart && $rootScope.luxire_cart.line_items){
      CustomerOrders.add_line_item($rootScope.luxire_cart, $scope.cart_object, variant)
      .then(function(data){
        CustomerOrders.get_order_by_id($rootScope.luxire_cart).then(function(data){
          $rootScope.luxire_cart = data.data;
          $rootScope.alerts.push({type: 'success', message: 'Item added to cart'});
          $scope.cancel();
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
        $scope.cancel();
        $state.go('customer.pre_cart');
        console.log(data);
      },function(error){
        $rootScope.alerts.push({type: 'danger', message: 'Failed to add to cart'});
        console.error(error);
      });
    }
  };

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
    console.log('after_conv',$scope[parent]);
    return $scope[parent];
  };

  $scope.select_gift_card_variant = function(variant){
    console.log('gift card variant', variant);
    $scope.selected_gift_card_variant = variant;
  };


  $scope.go_to_product_detail = function (product_name) {
    $uibModalInstance.close();
    $state.go('customer.product_detail',{product_name: product_name});


  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

// $scope.go_to_listing = function(taxonomy_name, taxonomy_id, taxon_name, taxon_id){
//   $uibModalInstance.close({
//     taxonomy_name: taxonomy_name,
//     taxonomy_id: taxonomy_id,
//     taxon_name: taxon_name,
//     taxon_id: taxon_id
//   });
// }
