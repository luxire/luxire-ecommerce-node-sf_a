angular.module('luxire')
.controller('luxirePropertiesHomeController',function($scope, $stateParams, luxireProperties, $state){
  $scope.loading = true;
  $scope.propertiesJson = [];
  luxireProperties.luxirePropertiesIndex().then(function(data) {
    $scope.loading = true;
    $scope.propertiesJson = data.data;
    console.log("properties: ",$scope.propertiesJson);
    $scope.loading = false;
  }, function(err){
    $scope.loading = true;
   console.log(err);
  })
  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------


  $scope.goToeditProperties=function(id){
    console.log("product properties params id in home: "+id);
    $state.go("admin.editluxireProperties",{id: id});
  }

  $scope.deleteProperty=function(id,index){

      console.log("deleted property id: \n"+id);
      $scope.propertiesJson.splice(index,1);
      luxireProperties.deleteProperty(id).then(function(data){
        $scope.alerts.push({type: 'success', message: 'Product Property Deleted Successfully!'});
        //alert('product property deleted successfully...');
      }, function(info) {
        console.log(info);
      })
  }


});
