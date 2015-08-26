angular.module('luxire')

.controller('productDetailsController',function($scope,products,$location,$routeParams,$rootScope) {

  var productID = $routeParams.id
  console.log('Product Id from route param: ' + productID);
  products.getProductByID(productID).then(function(data) {
			console.log(data.name);
			$scope.jsonresponse = data;
      $scope.page.setTitle($scope.jsonresponse.name)
		}, function(info) {
			console.log(info);
		})
  $scope.go = function(path){
		$location.path('/' + path)
	}
})
