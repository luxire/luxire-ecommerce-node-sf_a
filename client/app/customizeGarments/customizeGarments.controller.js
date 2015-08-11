 angular.module('luxire')
 .controller('customizeGarmentsController', function($scope, products, $location) {
 	$scope.go = function(path){
 		$location.path('/' + path)
 	}
 })
