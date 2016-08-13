angular.module('luxire')
.controller('DefaultController',function($scope, $stateParams){
  console.log($stateParams);
  $scope.go_to_crm = function(){
    window.open("http://crm.cloudhop.in/login?data=admin@example.com&data2=admin", "_blank");
  }
});
