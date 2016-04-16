angular.module('luxire')
/*Client ctrl instead of customer ctrl is used to
avoid conflict with customer ctrl on admin side*/
.controller('ClientController',function($scope, $rootScope, $state, CustomerOrders, $aside, CustomerProducts, CustomerConstants){

  CustomerProducts.taxonomy_index()
  .then(function(data){
    console.log('taxonomies', data);
    $scope.taxonomies = data.data.taxonomies;
  }, function(error){
    console.error(error);
  });

  /*Load products*/
  $scope.search_products_url = CustomerConstants.api.products+'?q[name_cont]=';
  console.log('search url', $scope.search_products_url);

  $scope.select_product = function(data){
    //TODO
    console.log(data);
    console.log(data.originalObject.classifications[0].taxon.pretty_name.split(' -> ')[0]);
    $state.go('customer.product_detail', {
      taxonomy_name: data.originalObject.classifications[0].taxon.pretty_name.split(' -> ')[0],
      taxon_name: data.originalObject.classifications[0].taxon.pretty_name.split(' -> ')[1],
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




  console.log('customer controller');
  CustomerOrders.get_order_by_cookie().then(function(data){
    console.log('data from cookie', data);
    if(data.data === "null"){
      console.log("No order found");
      $rootScope.luxire_cart = {};
    }
    else{
      console.log('cart not empty', $rootScope.luxire_cart);
      $rootScope.$broadcast('fetched_order_from_cookie', data);
      $rootScope.luxire_cart = data.data;
      console.log('cart not empty', $rootScope.luxire_cart);

    }
  }, function(error){
    console.error(error);
  });
  $rootScope.luxire_cart = angular.isUndefined($rootScope.luxire_cart)? {} : $rootScope.luxire_cart;
})
.controller('CustomerSideMenuController', function($scope, $state, taxonomies,$rootScope, $uibModalInstance, CustomerAuthentication, $location){
  console.log('taxonomies', taxonomies);
  $scope.taxonomies = taxonomies;

  $scope.go_to_collection = function(permalink){
    $location.url('/collections/'+permalink);
    $uibModalInstance.dismiss();
  };

  $scope.isLoggedIn = CustomerAuthentication.isLoggedIn();

  $scope.go_to_login = function(){
    $uibModalInstance.dismiss('cancel');
    $state.go('customer.login');
  }

  $scope.go_to_signup = function(){
    $uibModalInstance.dismiss('cancel');
    $state.go('customer.gignup');

  }

  $scope.go_to_logout = function(){
    $uibModalInstance.dismiss('cancel');
    CustomerAuthentication.logout();
    $rootScope.luxire_cart = [];
    $state.go('customer.login');

  }

  $scope.go_to_my_account = function(){
    $uibModalInstance.dismiss('cancel');
    $state.go('customer.my_account');
  };

  $scope.close_side_menu = function(){
    $uibModalInstance.dismiss();
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
