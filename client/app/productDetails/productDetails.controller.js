angular.module('luxire')

.controller('productDetailsController',function($scope, $rootScope, products,$location,$routeParams,$rootScope, $stateParams, $state) {

  /*Accesing route params*/
  var productID = $stateParams.id;
  $scope.cartObject = angular.isDefined($scope.cartObject) ? $scope.cartObject : {};
  $scope.cartObject['product_name'] = 'Diamond Textured Shirt';
  $scope.cartObject['product_price'] = '$29.95';
  $rootScope.cart = angular.isDefined($rootScope.cart) ? $rootScope.cart : [] ;

  console.log('Product Id from route param: ' + productID);

  /*Get a product with id= routeparam id*/
  products.getProductByID(productID).then(function(data) {
    $scope.page.setTitle(data.name);
			console.log(data.name);
			$scope.jsonresponse = data;
      $scope.cartObject['product_name'] = data.name;
      $scope.cartObject['product_price'] = data.price;
      angular.forEach(data.product_properties, function(value,key){
        var property_name = value['property_name'];
        $scope.cartObject[property_name] = '';
        // $scope.cartObject[property_name] = {
        //   id: 0,
        //   name: ''
        // };
        console.log(key+'  '+value['property_name']);
        console.log($scope.cartObject);
      })

		}, function(info) {
			console.log(info);
	});
  $scope.go = function(path){
		$location.path('/' + path)
	};
  /*view all styles*/
  $scope.showStyles = function(){
    // alert('Hello');
  };
  /*utility to mark a border around selected style*/
  $scope.activateStyle = function(id,selectedProperty,property){
    $scope.selectedStyleId = id;
    $scope.cartObject[property] = selectedProperty;
    // $scope.cartObject.style.id = id;
    // $scope.cartObject.style.name = selectedProperty;
    console.log($scope.cartObject);
  };

  $scope.displayCart = function(){
    console.log($scope.cartObject);
  }

  $scope.gotoCustomization = function(){
    $scope.displayCart();
    $state.go('customize',{cartObject: $scope.cartObject});
  }

  $scope.addItemToCart = function(){
    $rootScope.cart.push($scope.cartObject);
  }

})
