
angular.module('luxire')
.controller('invoiceController', function($scope,$rootScope,invoiceService,$stateParams, $location, CustomerOrders, ImageHandler) {

$scope.getImage = function(url){
  return ImageHandler.url(url);
};
console.log($stateParams.number);
console.log($stateParams.token);
console.log($location.search().token);
CustomerOrders.get_order_by_id({number: $stateParams.number, token: $stateParams.token})
.then(function(data){
  $scope.invoiceDetailedJson = data.data;
  console.log(data);
}, function(error){
  console.error(error);
})
// $scope.temp_ord_ID = $location.search().id;
// console.log($scope.temp_ord_ID);
// invoiceService.getInvoice($scope.temp_ord_ID).then(function(data) {
//   console.log("Hey this is geInvoice function of controller");
//   console.log("Data.data:",data.data);
//   $scope.invoiceDetailedJson = data.data;
// 	console.log("Array Elements:",$scope.invoiceDetailedJson);
//
// }, function(error){
//   console.log(error);
// });



})
