 angular.module('luxire')
 .controller('customizeGarmentsController', function($scope, products, $location) {
   $scope.page.setTitle('Customize')
 	$scope.go = function(path){
 		$location.path('/' + path)
 	}
 })
