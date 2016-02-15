angular.module('luxire')
.controller('styleMasterHomeController',function($scope,styleMasterService,$state){

  styleMasterService.getAllStyleMaster().then(function(data) {
    //$scope.loading= false;
    console.log("values of all style master \n\n");
    $scope.allStyleMasterType=data.data;
    console.log("\n\nall style master values are \n\n",data.data);

  }, function(info){
    console.log(info);
  })

  $scope.deleteStyleMaster=function(id,index){

      console.log("deleted style master id: \n"+id);
      $scope.allStyleMasterType.splice(index,1);
     styleMasterService.deleteStyleMaster(id).then(function(data){
        alert('style master  deleted successfully...');
        //$scope.activeButton('products')
      }, function(info) {
        console.log(info);
      })
  }

  $scope.editStyleMaster=function(id){
    console.log("style master params id in home: "+id);
    $state.go("admin.styleMasterEdit",{id: id});
  }


});
