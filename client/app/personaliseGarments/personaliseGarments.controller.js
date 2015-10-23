angular.module('luxire')
.controller('personaliseGarmentsController', function($scope, products, $location, $stateParams) {
	console.log($stateParams.cartObject);
	$scope.page.setTitle('Personalize')
	$scope.go = function(path){
		$location.path('/' + path)
	}
})
