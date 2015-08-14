 angular.module('luxire')
 .controller('adminController',function($scope, products, fileReader){
   $scope.navbar = "default";
   $scope.adminConsole = "default";
   $scope.isActive = false;

   $scope.activeButton = function(element) {
    $scope.isActive = !$scope.isActive;
    $scope.navbar = element;
  }

	products.getProducts().then(function(data) {
		console.log('admin');
    console.log(data);
		$scope.jsonresponse = data;
    console.log($scope.jsonresponse);
	}, function(info){
		console.log(info);
	})

  //controller function for file reader
$scope.uploadSponsorLogo = function(files) {
        if (files && files.length) {
        $scope.sponsorLogoFileName = files[0].name
        fileReader.readAsDataUrl(files[0], $scope).then(function(result) {
        $scope.productImage = result
      })
    }
  }

})
