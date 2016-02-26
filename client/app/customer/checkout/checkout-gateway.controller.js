angular.module('luxire')
.controller('checkoutGatewayController',function($scope, $state, $sce, orders, $rootScope, $stateParams){
  console.log($stateParams);
  $scope.payement_gateway_page = $stateParams.gatewayObject;
  $scope.myHTML = 'I am an <code>HTML</code>string with ' +
  '<a href="#">links!</a> and other <em>stuff</em>';
  $scope.getHtml = function(html){
        return $sce.trustAsHtml(html);
    };



});
