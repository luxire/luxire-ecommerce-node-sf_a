angular.module('luxire')
.controller('measurementGarmentsController', function($scope, products, $location) {
	$scope.go = function(path){
		$location.path('/' + path)
	}
})
