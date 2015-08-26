 angular.module('luxire')
 .controller('adminController',function($scope, products, fileReader, prototypeObject){
   console.log(new prototypeObject.product())
   $scope.navbar = "default";
   $scope.adminConsole = "default";
   $scope.isActive = false;

   $scope.page.setTitle("Admin Console")

   $scope.loading = false;

   $scope.productData  = new prototypeObject.product();

   $scope.colorTags = []
   $scope.seasonTags = []

   $scope.dummyColors = [
     {"text": "Red"},
     {"text": "White"},
      {"text": "Black"},
      {"text": "Gray"},
      {"text": "Powder Blue"},
      {"text": "Navy Blue"},
      {"text": "Royal Blue"},
      {"text": "Green"},
      {"text": "Light Green"},
      {"text": "Yellow"},
      {"text": "Orange"},
      {"text": "Crimson"},
      {"text": "Vermilion"},
      {"text": "Dark Red"},
      {"text": "Light Gray"},
      {"text": "Light Blue"}
   ]

   $scope.dummySeasons = [
     {"text": "Summer"},
     {"text": "Winter"},
     {"text": "Spring"},
     {"text": "Autumn"}
   ]

   $scope.loadTags = function(query) {
     if (query == 'color') {
       return $scope.dummyColors;
     } else if (query == 'season') {
       return $scope.dummySeasons;
     }
    return {};
  }

   $scope.activeButton = function(element) {
    $scope.isActive = !$scope.isActive;
    $scope.navbar = element;
    console.log($scope.navbar);

    $scope.loading = true;
    products.getProducts().then(function(data) {
  		console.log('admin');
      console.log(data);
  		$scope.jsonresponse = data;
      $scope.loading = false;
      console.log($scope.jsonresponse);
  	}, function(info){
  		console.log(info);
  	})
  }

$scope.getAllProducts = function (data) {
  $scope.loading = true;
  products.getProducts().then(function(data) {
		console.log('admin');
    console.log(data);
		$scope.jsonresponse = data;
    $scope.loading = false;
    console.log($scope.jsonresponse);
	}, function(info){
		console.log(info);
	})
}


  //controller function for file reader
$scope.uploadSponsorLogo = function(files) {
        if (files && files.length) {
        $scope.sponsorLogoFileName = files[0].name
        fileReader.readAsDataUrl(files[0], $scope).then(function(result) {
        $scope.productImage = result
      })
    }
  }

  $scope.createProduct = function() {
    console.log($scope.productData);
    products.createProduct($scope.productData).then(function(data){
      alert('Product successfully added');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }

  $scope.deleteProducts = function(id) {
    products.deleteProduct(id).then(function(data){
      alert('Product deleted successfully');
      $scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
  }

})

.directive('productHome', function() {
  return {
    templateUrl: 'app/admin/partial_templates/productsHome.html'
  };
})

.directive('addProduct', function() {
  return {
    templateUrl: 'app/admin/partial_templates/addProducts.html'
  };
})
