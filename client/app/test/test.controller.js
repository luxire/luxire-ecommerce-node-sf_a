angular.module('luxire')

.controller('testController', function($scope, products, $location) {
	$scope.getProducts =  function() {
		products.getProducts().then(function(data) {
			console.log(data);
			$scope.jsonresponse = data;
		}, function(info){
			console.log(info);
		})
	}

	$scope.getProductByID = function(id) {
		products.getProductByID(id).then(function(data) {
			console.log(data);
			$scope.jsonresponse = data;
		}, function(info) {
			console.log(info);
		})
	}

	$scope.createProduct = function(name, price, shipping_category) {
		products.createProduct(name, price, shipping_category).then(function(data){
			console.log(data);
			$scope.jsonresponse = data;
		}, function(info) {
			console.log(info);
		})
	}

	$scope.updateProduct = function(id,prod_parameters) {
		products.updateProduct(id,prod_parameters).then(function(data){
			console.log(data);
			$scope.jsonresponse = data;
		}, function(info) {
			console.log(info);
		})
	}

	$scope.deleteProduct = function(id) {
		products.deleteProduct(id).then(function(data){
			console.log(data);
			$scope.jsonresponse = data;
		}, function(info) {
			console.log(info);
		})
	}

})
