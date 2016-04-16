angular.module('luxire')
.controller('styleMasterHomeController',function($scope,styleMasterService,$state, ImageHandler){


  /*Image*/
  $scope.getImage = function(url){
    console.log(ImageHandler.url(url));
    return ImageHandler.url(url);
  };
  $scope.loading= true;
  styleMasterService.getAllStyleMaster().then(function(data) {
    $scope.loading= true;
    console.log("values of all style master \n\n");
    $scope.allStyleMasterType=data.data;
    console.log("\n\nall style master values are \n\n",data.data);
    $scope.loading= false;

  }, function(info){
    $scope.loading= true;
    console.log(info);

  })
  //$scope.loading = false;  // 18th march
  $scope.deleteStyleMaster=function(id,index){

      console.log("deleted style master id: \n"+index);
      $scope.allStyleMasterType.splice(index, 1);
      styleMasterService.deleteStyleMaster(id).then(function(data){
          $scope.alerts.push({type: 'success', message: 'Style Master  Deleted Successfully!'});
      }, function(info) {
        console.log(info);
        $scope.loading = true;
      })
  }

  $scope.editStyleMaster=function(id){
    console.log("style master params id in home: "+id);
    $state.go("admin.styleMasterEdit",{id: id});
  }


});
