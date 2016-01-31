angular.module('luxire')
.controller('newProductController', function($scope, products, $location) {
  $scope.productDesc=[];
  $scope.result=[];
  $scope.colorArr = [];
  $scope.priceArr = [];
  $scope.materialArr=[];
  $scope.weightArr=[];

  $scope.allOptions = [
    {
      "id": 1,
      "color1": "#00A026",
      "color2": "#000000",
      "color3": "#FF20A5"
    },
    {
      "id": 2,
      "color1": "#004624",
      "color2": "#9E0001",
      "color3": "#C0FF01"
    },
    {
      "id": 3,
      "color1": "#9E7300",
      "color2": "#01C9E0",
      "color3": "#5A7200"
    },
    {
      "id": 4,
      "color1": "#5A7389",
      "color2": "#3C7388",
      "color3": "#4B0082"
    },

  ];

  $scope.priceRange = [
    {
      "id": 1,
      "price": 0,
      "text":"Under 100$"
    },
    {
      "id": 2,
      "price": 100,
      "text":"100 to 250$"
    },
    {
      "id": 3,
      "price": 150,
      "text":"250 to 500$"
    },
    {
      "id": 4,
      "price": 200,
      "text":"above 500$"
    },

  ];
  $scope.materialOption=[
    {
    "id": 1,
    "text": "Cotton"
    },
    {
    "id": 2,
    "text": "Linen"
    },
    {
    "id": 3,
    "text": "Wool"
    },
    {
    "id": 4,
    "text": "Wool Flannel"
    }
];
$scope.weightOption=[
  {
  "id": 1,
  "text": "Light weight"
  },
  {
  "id": 2,
  "text": "Medium weight"
  },
  {
  "id": 3,
  "text": "Heavy weight"
  },
  {
  "id": 4,
  "text": "Others"
  }
];
$scope.images=[
  {
    "imgurl":"lib/assets/luxire_prod1.jpg",
    "text":"Grey wool Flannel",
    "price":"$100"
  },
  {
    "imgurl":"lib/assets/luxire_prod2.jpg",
    "text":"Grey wool Flannel",
    "price":"$100"

  },
  {
    "imgurl":"lib/assets/luxire_prod3.jpeg",
    "text":"Grey wool Flannel",
    "price":"$100"

  }
];
})
