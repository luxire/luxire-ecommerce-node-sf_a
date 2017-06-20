var luxire =  angular.module('luxire');
luxire.controller('GiftCardController',function($scope,$uibModal){

  $scope.giftCardObj = [
    {
      title: "Rs. 10",
      value: "10"
    },
    {
      title: "Rs. 25",
      value: "25"
    },
    {
      title: "Rs. 50",
      value: "50"
    },
    {
      title: "Rs. 100",
      value: "100"
    },
    {
      title: "Order over Rs. 6000",
      value: "1500"
    }
  ]

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
    {"text": "Autumn"},
    {"text": "Monsoon"}
  ]

  $scope.loadTags = function(query) {
    if (query == 'color') {
      return $scope.dummyColors;
    } else if (query == 'season') {
      return $scope.dummySeasons;
    }
   return {};
 }

$scope.searchText;
//This function is used to open the modal and the modal is to set the details for the issuing new gift card
$scope.open_new_gift_card = function(){
 var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy : 'modal-body',
      templateUrl : 'newGiftCardModal.html',
      controller: 'giftCardModalInstanceCtrl',
      size: 'lg',
    });
modalInstance.result.then(function(data){

})
}
});
//This is the newGiftCardModal controller 
luxire.controller('giftCardModalInstanceCtrl',function($scope,$uibModalInstance){
  $scope.editCode = false;
  $scope.initalValue = false;
  $scope.giftCode = '762a2e9e7c4f6daf';
  $scope.showEditCode = function(){
    $scope.editCode = true;
  }
  $scope.initialzeGiftCard = function(a){
    if(a == 'other'){
      $scope.initalValue = true;
    }
    else{
      $scope.initial_value = a;
      console.log('the selected initial value is',$scope.initial_value);
    }
  }
  $scope.calculateInitialValue = function(value){
    $scope.initial_value = value;
  }
    //This is datapicker 
  $scope.datePicker = new Date();
  //This function is to display the date in custom format as dd/mm/yyyy
  $scope.dateFunction = function(date){
    var dt = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  $scope.date = dt+'/'+month+'/'+year;
  }($scope.datePicker);
  $scope.selectedDate = $scope.date;
  $scope.popup2 = {
    opened: false
  };
  $scope.open2 = function() {
    $scope.popup2.opened = true;
    $scope.selectedDate = $scope.dt;
  };
$scope.ok = function(){
  $uibModalInstance.close({giftCode : $scope.giftCode , initalValue : $scope.initial_value, date : $scope.selectedDate});
}
$scope.cancel = function(){
    $uibModalInstance.dismiss('cancel');
  }
});
