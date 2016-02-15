angular.module('luxire')
.controller('CustomerHomeController', function($scope, $state){
  $scope.go_to_product_listing = function(taxonomy_name, taxon_name){
    $state.go('customer.product_listing', {taxonomy_name: taxonomy_name,taxon_name: taxon_name});
  };
});
