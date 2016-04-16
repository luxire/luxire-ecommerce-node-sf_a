angular.module('luxire')
.controller('editLuxirePropertiesController',function($scope,$timeout, $stateParams, $state,luxireProperties){
  $scope.loading = true;
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


  console.log("property id is: "+$stateParams.id);
  luxireProperties.luxirePropertiesById($stateParams.id).then(function(data) {
    $scope.loading = true;
    //$scope.alerts.push({type: 'success', message: 'Added quantity successfully!'});
    $scope.propertyValue = data.data;
    console.log("propertie value : ",$scope.propertyValue);
    $scope.loading = false;
  }, function(err){
   console.log(err);
   $scope.loading = true;

  })
  $scope.checkStyleMasterName = function(name){  // 29th march add this function
    if(name == undefined || name == '' || name == 0){
      $scope.emptyValueMsg = true;
      document.getElementById("name").focus();
    }else{
        $scope.emptyValueMsg = false;
    }
  }
  $scope.checkStyleMasterValue = function(value){  // 29th march add this function
    if(value == undefined || value == '' || value == 0){
      $scope.emptyValueMsg = true;
      document.getElementById("value").focus();
    }else{
      $scope.emptyValueMsg = false;
    }
  }
  $scope.saveProperty = function(){
    console.log("save property is calling..");
    var updated_property={
      "name": $scope.propertyValue.name,
      "value":$scope.propertyValue.value
    }
    luxireProperties.luxireProperties_update($stateParams.id,updated_property).then(function(data) {
      $scope.alerts.push({type: 'success', message: 'Product Property Updated Successfully!'});
      $timeout(function() {
        console.log("timeout functionality...");
        $state.go("admin.luxirePropertiesHome");
      }, 3000);

      //alert("property updated sucessfully...");
      console.log(data);
    }, function(err){
     console.log(err);
     $scope.loading = true;
    })
  }


});
