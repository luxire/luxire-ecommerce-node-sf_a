angular.module('luxire')
.filter('unique', function() {
   return function(collection, keyname) {
      var output = [],
          keys = [];

      angular.forEach(collection, function(item) {
          var key = item[keyname];
          if(keys.indexOf(key) === -1) {
              keys.push(key);
              output.push(item);
          }
      });
      return output;
   };
})
.controller("filterController",function($scope,$filter,products,$http){
$scope.productDesc=[];
$scope.result=[];
$scope.store=[];



  /*$http.get('/query')
  .success(function(data){
    var res = data.data;
    console.log("productDescription\n\n",data.data);

    var end = new Date().getTime();
  })
  .error(function(err){
    console.log("error: fetching value from redis server");
  })*/
  $http.get('/productDescription')
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
  var unique=function(arr){
    var unique=[];
    for(i=0;i<arr.length;i++){
      if(unique.indexOf(arr[i])<0)
        unique.push(arr[i]);
    }
    return unique;
  }

  $scope.filterColor=function(filterColor){
      var temp=[];
      console.log("check1"+$scope.check1);
      console.log("check1: "+$scope.check1);
      console.log("filterColor :"+filterColor);
      temp=$filter('filter')($scope.result.tags,filterColor);
      $scope.store=$scope.store.concat(temp);
      $scope.productDesc=angular.copy(unique($scope.store));
      console.log("after filteration: "+$scope.productDesc);

  }
  $scope.myFilter=function(product){
      for(i=0;i<product.tags.length;i++){
        if(product.tags[i]==='blue' || product.tags[i]=='red' || product.tags[i]=='yellow')
          return product;
      }
  }



})
