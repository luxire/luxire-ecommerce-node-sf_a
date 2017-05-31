angular.module('luxire')
.controller('luxirePropertiesHomeController',function($scope, $stateParams, luxireProperties, $state){
  $scope.loading = true;
  $scope.propertiesJson = [];//contains the product property details
  luxireProperties.luxirePropertiesIndex().then(function(data) {
    $scope.loading = true;
    $scope.propertiesJson = data.data;
    $scope.loading = false;
  }, function(err){
    $scope.loading = true;
   console.log(err);
  })
  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];//contains the alert messages
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    $scope.alerts.splice(index, 1);
  };

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------

//used to redirect to the product property edit page
  $scope.goToeditProperties=function(id){
    $state.go("admin.editluxireProperties",{id: id});
  }
//used to delete the product property
  $scope.deleteProperty=function(id,index){
      $scope.propertiesJson.splice(index,1);
      //service used to delete the product property
      luxireProperties.deleteProperty(id).then(function(data){
        $scope.alerts.push({type: 'success', message: 'Product Property Deleted Successfully!'});
      }, function(info) {
        console.log(info);
      })
  }


});
