angular.module('luxire')

.controller('productDetailsController',function($scope,products,$location) {

  products.getProductByID(17).then(function(data) {
			console.log(data);
			$scope.jsonresponse = data;
		}, function(info) {
			console.log(info);
		})
  $scope.go = function(path){
		$location.path('/' + path)
	}
})
