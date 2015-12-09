angular.module('luxire')
.controller('GiftCardController',function($scope){

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


});
