angular.module('luxire')
.controller('productListingController', function($scope, products, $location) {

  $scope.productDesc=[];
   $scope.result=[];
   $scope.colorArr = [];
   $scope.priceArr = [];
   $scope.materialArr=[];
   $scope.weightArr=[];
   $scope.topSearchBar=true;
   var topSearchBaeCount=-1;

   $scope.showTopSearchBar=function(){
        //console.log("fun is calling..");
        topSearchBaeCount++;
        if(topSearchBaeCount % 2===0){
           $scope.topSearchBar=false;
        }else {
          $scope.topSearchBar=true;
        }
   }

   $scope.priceFilter=[
     {
       "id": 1,
       "name": 'Most Popular',
       "selected":true
     },
     {
       "id": 2,
       "name": 'New Arrival',
       "selected":false
     },
     {
       "id": 3,
       "name": 'Price <Low to High>',
       "selected":false
     },
     {
       "id": 4,
       "name": 'Price <High to Low>',
       "selected":false
     },
   ];

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
 $scope.casualFabrics=[
   {
     "imgurl":"lib/filter-img/fabric1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"
   },
   {
     "imgurl":"lib/filter-img/fabric2.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/fabric4.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/fabric1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"
   },
   {
     "imgurl":"lib/filter-img/fabric2.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/fabric4.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   }
 ];
 $scope.dressFabrics=[
   {
     "imgurl":"lib/filter-img/luxire_prod3.jpeg",
     "text":"Grey wool Flannel",
     "price":"$100"
   },
   {
     "imgurl":"lib/filter-img/luxire_prod3.jpeg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/luxire_prod3.jpeg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/luxire_prod3.jpeg",
     "text":"Grey wool Flannel",
     "price":"$100"
   },
   {
     "imgurl":"lib/filter-img/luxire_prod3.jpeg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/luxire_prod3.jpeg",
     "text":"Grey wool Flannel",
     "price":"$100"

   }
 ];
 $scope.formalFabrics=[
   {
     "imgurl":"lib/filter-img/luxire_prod1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"
   },
   {
     "imgurl":"lib/filter-img/luxire_prod1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/luxire_prod1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/luxire_prod1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"
   },
   {
     "imgurl":"lib/filter-img/luxire_prod1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   },
   {
     "imgurl":"lib/filter-img/luxire_prod1.jpg",
     "text":"Grey wool Flannel",
     "price":"$100"

   }
 ];
 $scope.productObj=$scope.casualFabrics;
 $scope.showCasual=function(){
   $scope.productObj=$scope.casualFabrics;
 }
 $scope.showFormal=function(){
   $scope.productObj=$scope.formalFabrics;
 }
 $scope.showDress=function(){
   $scope.productObj=$scope.dressFabrics;
 }
})
