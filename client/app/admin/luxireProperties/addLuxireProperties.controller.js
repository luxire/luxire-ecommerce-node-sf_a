angular.module('luxire')
.controller('addluxirePropertiesController',function($scope,$timeout,$state, $stateParams, luxireProperties){
  //$scope.loading =true;
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
    if(($scope.property.name == undefined || $scope.property.name == '' || $scope.property.name == 0) // 29th march add this if-else condition
        ||  ($scope.property.value == undefined || $scope.property.value == '' || $scope.property.value == 0)
    ){
        $scope.alerts.push({type: 'danger', message: 'Name Field Can Not Be Empty !'});
        document.getElementById("name").focus();
    }else{
      var create_property={
        "name": $scope.property.name,
        "value":$scope.property.value
      }
      luxireProperties.luxireProperties_create(create_property).then(function(data) {
        $scope.alerts.push({type: 'success', message: 'Product Property Created Successfully!'});
        $timeout(function() {
          console.log("timeout functionality...");
          $state.go("admin.luxirePropertiesHome");
        }, 3000);
        //alert("property created sucessfully...");
        console.log("created property: ",data);
      }, function(err){
       console.log(err);
       $scope.loading = true;
      })
    }

  }
});
