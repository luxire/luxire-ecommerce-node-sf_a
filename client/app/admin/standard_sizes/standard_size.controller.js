angular.module('luxire')
.controller('standardSizeController',function($scope,standardSizeService,$state,$timeout){
$scope.standardSizeData = [];

//Alerts to display the message
$scope.alerts = [];
var alert = function(){
  this.type = '';
  this.message = '';
};
$scope.close_alert = function(index){
  console.log(index);
  $scope.alerts.splice(index, 1);
};


  //Display all the Standard size
    $scope.loading = true;
    standardSizeService.getAllStandardSize().then(function(data) {
      console.log("Hey this is getAllStandardSize function of controller");
      console.log('List of StandardSize\n');
      console.log(data.data);
      $scope.standardSizeData = data.data;
      $scope.loading = false;
      console.log($scope.standardSizeData);
    }, function(info){
      console.log(info);
    })

    //Hyperlinks in home which will invoke editpage
    $scope.showEditStandardSize=function(id){
      console.log("Id of Std_size  in home: "+id);
      $state.go("admin.editStandardSize",{id: id});
    }
    standardSizeService.allProductType().then(function(data) {
  		console.log("values of all product type \n\n");
  		$scope.allproductType=data.data;
  		console.log("\n\nall product type values are \n\n",data.data);

  	}, function(info){
  		console.log(info);
  	})

  	$scope.showProductType=function(){
  		console.log("select product type is calling..");
  		 console.log("selected product type is "+$scope.newProductType.type);
  		 productTypeId=$scope.newProductType.type;
  		 console.log("selected product type id: "+productTypeId);

  	}
    //create
      $scope.save = function() {
        console.log("Create button clicked");
        console.log($scope.standardSizeData);
        if($scope.new_fit_type == '' ||
            $scope.new_fit_type == 0 ||
            $scope.new_fit_type == undefined ||
            $scope.new_luxire_product_type_id == '' ||
            $scope.new_luxire_product_type_id == 0 ||
            $scope.new_luxire_product_type_id == undefined){

          document.getElementById("FitType").focus();
          document.getElementById("productTypeSelect").focus();
          $scope.alerts.push({type: 'danger', message: 'mandatory fields are empty!'});

        }
        else{
            // console.log("new_luxire_product_type_id: ",$scope.new_luxire_product_type_id);
            // console.log("typeof new_luxire_product_type_id: ",typeof(parseInt($scope.new_luxire_product_type_id)));
          $scope.new_standardSizeData = {
            "fit_type":$scope.new_fit_type ,
            "neck":$scope.new_neck,
            "chest":$scope.new_chest,
            "waist":$scope.new_waist,
            "bottom":$scope.new_bottom,
            "yoke":$scope.new_yoke,
            "biceps":$scope.new_biceps,
            "wrist":$scope.new_wrist,
            "shirt_length":$scope.new_shirt_length,
             "luxire_product_type_id": parseInt($scope.new_luxire_product_type_id)
          };
          $scope.standardSizeData.push($scope.new_standardSizeData);
          // console.log("data sent to the server:",JSON.stringify($scope.standardSizeData));
          standardSizeService.createStandardSize($scope.new_standardSizeData).then(function(data){
            // alert("Size added successfully")
            $scope.alerts.push({type: 'success', message: 'Size added successfully!'});
            $timeout(function(){
              console.timeEnd('timeout');
              $state.go('admin.standard_sizes');

            }, 3000)

        }, function(error){
          console.log(error);
          console.log('create failed');
          $scope.alerts.push({type: 'danger', message: 'Creation Failed!'});

        });
      }
    }


    //Deleting
      $scope.deleteStandardSize = function(id,index) {
        console.log("Delete controller");
        console.log(  $scope.standardSizeData);
        standardSizeService.deleteStandardSizeById(id).then(function(data){
        // alert("deleted successfully");
        $scope.standardSizeData.splice(index,1);
        $scope.alerts.push({type: 'success', message: 'Size deleted successfully!'});

          console.log("Deleted data\n",data);

      }, function(error) {
          console.log(error);
          $scope.alerts.push({type: 'danger', message: 'Deletion Failed!'});

        })

      }


})


.controller('editStandardSizeController',function($scope,standardSizeService,$state,$stateParams,$timeout){


  standardSizeService.allProductType().then(function(data) {
    //$scope.loading= false;
    console.log("values of all product type \n\n");
    $scope.allproductType=data.data;
    console.log("\n\nall product type values are \n\n",data.data);

  }, function(info){
    console.log(info);
  })

  $scope.showProductType=function(){
    console.log("select product type is calling..");
     console.log("selected product type is "+$scope.newProductType.type);
     productTypeId=$scope.newProductType.type;
     console.log("selected product type id: "+productTypeId);

  }
  console.log("state params id : ",$stateParams.id);
  $scope.loading = true;
  standardSizeService.getStandardSizeById($stateParams.id).then(function(data){
    console.log(data.data);
    console.log("data.data.luxire_product_type_id ",data.data.luxire_product_type_id );
    $scope.fit_type = data.data.fit_type;
     $scope.neck = parseFloat(data.data.neck);
     $scope.chest = parseInt(data.data.chest);
     $scope.waist = parseInt(data.data.waist);
     $scope.bottom = parseInt(data.data.bottom);
     $scope.yoke = parseInt(data.data.yoke);
     $scope.biceps = parseInt(data.data.biceps);
    $scope.wrist = parseInt(data.data.wrist);
    $scope.shirt_length = parseInt(data.data.shirt_length);
     $scope.luxire_product_type_id = data.data.luxire_product_type_id ;
     $scope.loading = false;
    console.log("in getStandardSizeById  function");

    }, function(info) {
     console.log(info);
  })


  $scope.updateStandardSize = function(id) {
    if($scope.fit_type == '' ||
        $scope.fit_type == 0 ||
        $scope.fit_type == undefined ||
        $scope.luxire_product_type_id == '' ||
        $scope.luxire_product_type_id == 0 ||
        $scope.luxire_product_type_id == undefined){

      document.getElementById("FitType").focus();
      document.getElementById("productTypeSelect").focus();
      $scope.alerts.push({type: 'danger', message: 'mandatory fields are empty!'});

    }
    else{
    var updatedStandardSizeObj ={
      "fit_type": $scope.fit_type,
      "neck" : parseInt($scope.neck),
      "chest" : parseInt($scope.chest),
      "waist" : parseInt($scope.waist),
      "bottom" : parseInt($scope.bottom),
      "yoke" : parseInt($scope.yoke),
      "biceps" : parseInt($scope.biceps),
      "wrist" : parseInt($scope.wrist),
      "shirt_length" : parseInt($scope.shirt_length),
      "luxire_product_type_id":$scope.luxire_product_type_id

    }
    console.log("json data------",updatedStandardSizeObj);
    standardSizeService.updateStandardSizeById($stateParams.id,updatedStandardSizeObj).then(function(data){
      console.log("id",$stateParams.id);
      console.log(" after update data",data.data);
      // alert(" updated successfully");
      $scope.alerts.push({type: 'success', message: 'Size updated successfully!'});
      $timeout(function(){
        console.timeEnd('timeout');
        $state.go('admin.standard_sizes');

      }, 3000)

  }, function(error) {
        console.log(error);
        console.log('upadation failed');
        $scope.alerts.push({type: 'danger', message: 'Size updation Failed!'});

      })
    }
  }

})
