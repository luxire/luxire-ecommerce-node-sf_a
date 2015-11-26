
angular.module('luxire')
.controller('collectionController', function($scope, products, $location) {
	$scope.name = "MudassirH";
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  $scope.slideIndexes = []
  $scope.slides = [
    {image: 'lib/assets/carousel_img2.jpg'},
    {image: 'lib/assets/carousel_img3.jpg'},
    {image: 'lib/assets/carousel_img5.jpg'},
  ];
  for (var i=0;i<$scope.slides.length;i++){
    $scope.slideIndexes.push(i)
  };
  $scope.change_slide = function(index){
    console.log(index);
    $scope.slides[index].active = true;
  };
  $scope.gotoProduct = function(){
    location.href = "#/productdetails/19"
  }

})
