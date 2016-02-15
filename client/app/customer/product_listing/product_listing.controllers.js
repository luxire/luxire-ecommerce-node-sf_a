angular.module('luxire')
.controller('ProductListingController', function($scope, $state, $stateParams){
  console.log($stateParams);
  $scope.go_to_product_detail = function(taxonomy_name, taxon_name, product_name){
    $state.go('customer.product_detail',{taxonomy_name: taxonomy_name,taxon_name: taxon_name,product_name: product_name});
  };

})
