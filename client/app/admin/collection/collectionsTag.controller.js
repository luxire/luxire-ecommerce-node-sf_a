angular.module('luxire')
.controller('collectionsTagController',function($scope,$http){
  $scope.tagsObg='';

  $http.get('/query')
  .success(function(data){
    console.time("fetchTagTime: ");
    $scope.tagsObg=data.data;
    console.log("tags values are: \n\n",$scope.tagsObg);
    console.timeEnd("fetchTagTime: ");

  })
  .error(function(err){
    console.log("error: fetching value from redis server");
  })

});
