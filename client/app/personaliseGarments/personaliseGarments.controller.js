angular.module('luxire')
.controller('personaliseGarmentsController', function($scope, products, $location) {
	$scope.go = function(path){
		$location.path('/' + path)
	}
})
