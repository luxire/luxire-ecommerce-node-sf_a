 angular.module('luxire')
 .controller('adminController',function($scope){
   $scope.navbar = "default";
   $scope.adminConsole = "default";
   $scope.isActive = false;
   $scope.activeButton = function(element) {
    $scope.isActive = !$scope.isActive;
    $scope.navbar = element;
  }
})
