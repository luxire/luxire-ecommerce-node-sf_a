angular.module('luxire')
/*Client ctrl instead of customer ctrl is used to
avoid conflict with customer ctrl on admin side*/
.controller('ClientController',function($scope, $rootScope, $state, CustomerOrders, $aside, CustomerProducts, CustomerConstants, $location){
  var prev_state = '';
  $scope.show_header = true;
  $scope.header_visibility = function(state){
    console.log('current state', state);
    if(state.name!==prev_state){
      if(state.name.indexOf('checkout') !==-1){
        console.log('checkout state');
        $scope.show_header = false;
      }
      else{
        console.log(' not a checkout state');
        $scope.show_header = true;
      }
      prev_state = state.name;
    }


  }
  $scope.header_visibility($state.current);
  $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    $scope.header_visibility(toState);
    console.log('changing state', toState);
  })


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
  $scope.search_products_url = CustomerConstants.api.products+'?q[name_cont]=';

  $scope.select_product = function(data){
    $scope.show_search_panel = false;
    console.log('selected product', data);
    $state.go('customer.product_detail', {
      product_name: data.originalObject.slug
    });
  };

  $scope.open_side_menu = function(){
    console.log('opening side menu');
    var asideInstance = $aside.open({
      templateUrl: 'customer_side_menu.html',
      controller: 'CustomerSideMenuController',
      placement: 'right',
      size: 'sm',
      backdrop: 'true',
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
  }, function(error){
    console.error('data from cookie', error);
    $rootScope.$broadcast('fetched_order_from_cookie', error);
  });
  $rootScope.luxire_cart = angular.isUndefined($rootScope.luxire_cart)? {} : $rootScope.luxire_cart;

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
.controller('quickViewModalController',function($scope, $uibModalInstance, product, is_fabric_taxonomy, CustomerOrders, $state, ImageHandler){
  console.log('product', product);
  console.log('is fabric', is_fabric_taxonomy);
  $scope.fabric_taxonomy = is_fabric_taxonomy;
  $scope.weight_index = function(variant_weight){
    console.log('variant_weight', variant_weight);
    console.log(parseFloat(variant_weight)-50)
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

  $scope.quickViewProduct = product;
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
