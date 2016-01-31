angular.module('luxire')
.controller("filterController",function($scope,$filter,products,$http){
  $scope.productDesc=[];
  $scope.result=[];
  $scope.colorArr = [];
  $scope.priceArr = [];
  $scope.materialArr=[];
  $scope.weightArr=[];

  $scope.allOptions = [
    {
      "id": 1,
      "color": "blue",
    },
    {
      "id": 2,
      "color": "red",
    },
    {
      "id": 3,
      "color": "yellow",
    },
    {
      "id": 4,
      "color": "green",
    },
    {
      "id": 5,
      "color": "white",
    },
  ];

  $scope.priceRange = [
    {
      "id": 1,
      "price": 0,
      "text":"below 100$"
    },
    {
      "id": 2,
      "price": 100,
      "text":"100$ - 150$"
    },
    {
      "id": 3,
      "price": 150,
      "text":"150$ - 200$"
    },
    {
      "id": 4,
      "price": 200,
      "text":"200$ - 250$"
    },
    {
      "id": 5,
      "price": 250,
      "text":"250$ - 300$"
    },
    {
      "id": 6,
      "price": 300,
      "text":"300$ & above"
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
  /*$http.get('/query')
  .success(function(data){
    var res = data.data;
    console.log("products\n\n",data.data);

    var end = new Date().getTime();
  })
  .error(function(err){
    console.log("error: fetching value from redis server");
  }) */

   $scope.isCheckedColor = function(id){
       var match = false;
       for(var i=0 ; i < $scope.colorArr.length; i++) {
         if($scope.colorArr[i].id == id){
           match = true;
         }
       }
       return match;
   };
   $scope.isCheckedPrice = function(id){
       var match = false;
       for(var i=0 ; i < $scope.priceArr.length; i++) {
         if($scope.priceArr[i].id == id){
           match = true;
         }
       }
       return match;
   };
   $scope.isCheckedMaterial = function(id){
       var match = false;
       for(var i=0 ; i < $scope.materialArr.length; i++) {
         if($scope.materialArr[i].id == id){
           match = true;
         }
       }
       return match;
   };
   $scope.isCheckedWeight = function(id){
       var match = false;
       for(var i=0 ; i < $scope.weightArr.length; i++) {
         if($scope.weightArr[i].id == id){
           match = true;
         }
       }
       return match;
   };

   $http.get('/redis_products')
   .success(function(data){
     var res = data.data;
     console.log("data\n\n",data.data);
     $scope.productDesc=res.product;
     $scope.result=res.product;
     var end = new Date().getTime();
   })
   .error(function(err){
     console.log("error: fetching value from redis server");
   })



   $scope.syncColor = function(bool, color){
     if(bool){
       // add item
       $scope.colorArr.push(color);
     } else {
       // remove item
       for(var i=0 ; i < $scope.colorArr.length; i++) {
         if($scope.colorArr[i] == color){
           $scope.colorArr.splice(i,1);
         }
       }
     }
   };
   $scope.syncPrice = function(bool, price){
     if(bool){
       // add item
       $scope.priceArr.push(price);
     } else {
       // remove item
       for(var i=0 ; i < $scope.priceArr.length; i++) {
         if($scope.priceArr[i] == price){
           $scope.priceArr.splice(i,1);
         }
       }
     }
   };
   $scope.syncMaterial = function(bool, material){
     if(bool){
       // add item
       $scope.materialArr.push(material);
     } else {
       // remove item
       for(var i=0 ; i < $scope.materialArr.length; i++) {
         if($scope.materialArr[i] == material){
           $scope.materialArr.splice(i,1);
         }
       }
     }
   };
   $scope.syncWeight = function(bool, price){
     if(bool){
       // add item
       $scope.weightArr.push(price);
     } else {
       // remove item
       for(var i=0 ; i < $scope.weightArr.length; i++) {
         if($scope.weightArr[i] == price){
           $scope.weightArr.splice(i,1);
         }
       }
     }
   };

   $scope.colorFilter=function(product){
     if($scope.colorArr.length==0)
          return product;
    else{
     var temp=[];
     for(i=0;i<$scope.colorArr.length;i++){
       if(product.color==$scope.colorArr[i])
            return product;
     }
     return '';
   }
   }

   $scope.priceFilter=function(product){
     if($scope.priceArr.length==0)
        return product;
    else{
     //var temp=[];
     for(i=0;i<$scope.priceArr.length;i++){
       if($scope.priceArr[i]==300){
         if(product.price>=$scope.priceArr[i])
            return product;
       }
       if(product.price >= $scope.priceArr[i] && product.price <= ($scope.priceArr[i]+50)){
       //temp=product;
       console.log("priceFiltered :"+product.id);
       return product;
     }
     }
     return '';
   }
   }

   $scope.materialFilter=function(product){
     if($scope.materialArr.length==0)
        return product;
    else{
     console.log("material filter is calling with product price: "+product.price);
     var temp=[];
     for(i=0;i<$scope.materialArr.length;i++){
       if(product.material == $scope.materialArr[i]){
       console.log("materialFiltered :"+product.id);
       return product;
     }
     }
     return '';
   }
   }

   $scope.weightFilter=function(product){
     if($scope.weightArr.length==0)
        return product;
    else{
     console.log("weight filter is calling with product price: "+product.weight);
     var temp=[];
     for(i=0;i<$scope.weightArr.length;i++){
       if(product.weight == $scope.weightArr[i]){
       console.log("weightFiltered :"+product.id);
       return product;
     }
     }
     return '';
   }
   }

   $scope.defaultFilter=function(){
     if($scope.data.length==0 && $scope.priceArr.length==0 && $scope.materialArr.length==0 && $scope.weightArr.length==0){
       $scope.productDesc=angular.copy($scope.result);
       console.log("defaultFilter: ",$scope.productDesc);
     }else
        return '';
   }



})
