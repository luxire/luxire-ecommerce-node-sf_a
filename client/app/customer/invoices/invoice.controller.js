
angular.module('luxire')
.controller('invoiceController', function($scope,$rootScope,invoiceService,$stateParams, $location, CustomerOrders, ImageHandler) {

$scope.setReload = function(){
  $rootScope.reloadPage = true;
}
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

  $scope.checkGiftCardPaymentOption = function(){
  var paidByGiftCard = false;
  var adjustments = $scope.invoiceDetailedJson.adjustments;
  for(var counter=0; counter < adjustments.length; counter++){
    if(adjustments[counter].source_type === "Spree::GiftCard"){
      paidByGiftCard = true;
      break;
    }
   }
  return paidByGiftCard;
  }

  $scope.getGiftCardTotal = function(){
   var paidByGiftCard = 0;
  $scope.invoiceDetailedJson.adjustments.forEach(function(element) {
    if(element.source_type === "Spree::GiftCard"){
      paidByGiftCard += Math.abs(parseFloat(element.amount));
    }
  })
  return $scope.invoiceDetailedJson.display_item_total[0] + paidByGiftCard.toFixed(2);
 }
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
