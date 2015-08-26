angular.module('luxire')
.controller('personaliseGarmentsController', function($scope, products, $location) {
	$scope.page.setTitle('Personalize')
	$scope.go = function(path){
		$location.path('/' + path)
	}
})
