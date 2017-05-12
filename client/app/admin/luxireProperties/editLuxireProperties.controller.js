angular.module('luxire')
.controller('editLuxirePropertiesController',function($scope,$timeout, $stateParams, $state,luxireProperties){
  $scope.loading = true;
  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];//contains the alert messages
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    //console.log(index);
    $scope.alerts.splice(index, 1);
  };

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------
//used to get the product property details
  luxireProperties.luxirePropertiesById($stateParams.id).then(function(data) {
    $scope.loading = true;
    $scope.propertyValue = data.data;
    $scope.loading = false;
  }, function(err){
   console.log(err);
   $scope.loading = true;
  })
   //ensuring the mandatory fields (here product property name) is entered or not
  $scope.checkStyleMasterName = function(name){  // 29th march add this function
    if(name == undefined || name == '' || name == 0){
      $scope.emptyValueMsg = true;
      document.getElementById("name").focus();
    }else{
        $scope.emptyValueMsg = false;
    }
  }
   //ensuring the mandatory fields (here product property value) is entered or not
  $scope.checkStyleMasterValue = function(value){  // 29th march add this function
    if(value == undefined || value == '' || value == 0){
      $scope.emptyValueMsg = true;
      document.getElementById("value").focus();
    }else{
      $scope.emptyValueMsg = false;
    }
  }
  //used to update the product property details
  $scope.saveProperty = function(){
    var updated_property={
      "name": $scope.propertyValue.name,
      "value":$scope.propertyValue.value
    }
    //service used to update the product property details
    luxireProperties.luxireProperties_update($stateParams.id,updated_property).then(function(data) {
      $scope.alerts.push({type: 'success', message: 'Product Property Updated Successfully!'});
      $timeout(function() {
        $state.go("admin.luxirePropertiesHome");
      }, 3000);
      console.log(data);
    }, function(err){
     console.log(err);
     $scope.loading = true;
    })
  }


});
