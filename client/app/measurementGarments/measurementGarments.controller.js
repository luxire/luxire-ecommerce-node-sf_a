angular.module('luxire')
.controller('measurementGarmentsController', function($scope, products, $location) {
	$scope.page.setTitle('Measurement')
	$scope.go = function(path){
		$location.path('/' + path)
	}
})
