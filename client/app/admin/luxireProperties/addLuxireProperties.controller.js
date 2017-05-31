angular.module('luxire')
.controller('addluxirePropertiesController',function($scope,$timeout,$state, $stateParams, luxireProperties){
  //$scope.loading =true;
  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];//contains alert messages
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------
  //ensuring the mandatory fields (here product property name) is entered or not
  $scope.checkStyleMasterName = function(name){  // 29th march add this function
    if(name == undefined || name == '' || name == 0){
      $scope.emptyNameMsg = true;
      $scope.alerts.push({type: 'danger', message: 'Name Field Can Not Be Empty !'});
      document.getElementById("name").focus();
    }else{
        $scope.emptyNameMsg = false;
    }
  }
   //ensuring the mandatory fields (here product property value) is entered or not
  $scope.checkStyleMasterValue = function(value){  // 29th march add this function
    if(value == undefined || value == '' || value == 0){
      $scope.emptyValueMsg = true;
       $scope.alerts.push({type: 'danger', message: 'Value Field Can Not Be Empty !'});
      document.getElementById("value").focus();
    }else{
      $scope.emptyValueMsg = false;
    }
  }
  //create the product property
  $scope.saveProperty = function(){
    console.log("save property is calling..");
    if($scope.property.name == undefined || $scope.property.name == '' || $scope.property.name == 0) // 29th march add this if-else condition
    {
        $scope.alerts.push({type: 'danger', message: 'Name Field Can Not Be Empty !'});
        document.getElementById("name").focus();
    }
    else if ($scope.property.value == undefined || $scope.property.value == '' || $scope.property.value == 0){
       $scope.alerts.push({type: 'danger', message: 'Value Field Can Not Be Empty !'});
       document.getElementById("value").focus();
      }else{
      var create_property={
        "name": $scope.property.name,
        "value":$scope.property.value
      }
      //service used to create the product property
      luxireProperties.luxireProperties_create(create_property).then(function(data) {
        $scope.alerts.push({type: 'success', message: 'Product Property Created Successfully!'});
        $timeout(function() {
          $state.go("admin.luxirePropertiesHome");
        }, 3000);
      }, function(err){
       console.log(err);
       $scope.loading = true;
      })
    }

  }
});
