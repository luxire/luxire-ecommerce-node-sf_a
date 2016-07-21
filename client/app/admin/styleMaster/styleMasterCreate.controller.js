angular.module('luxire')
.controller('styleMasterCreateController',function($scope, $state, $timeout, styleMasterService, ImageHandler, productSearch ){

  $scope.allproductType='';
  $scope.allMeasurementType={};
  $scope.newProductType={};
  $scope.bodyMeasurement=[];
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
  $scope.loading = true;
  styleMasterService.getAllProductType().then(function(data) {
    // $scope.loading= true;
    $scope.allproductType=data.data;
    $scope.loading = false;
  }, function(info){
    console.log(info);
    $scope.loading = false;

  })

  /*Image upload*/
  $scope.upload_image = function(files){
    console.log('typeof', typeof(files[0]));
    console.log('product image', typeof(files[0]));
    if (files && files.length) {
      $scope.style_image = files[0];
      console.log('files to upload',files[0]);
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#style_master_img').attr('src', e.target.result);
       }

       reader.readAsDataURL(files[0]);
    }
  }

  $scope.getImage = function(url){
    //console.log(url);
    console.log("_______________image handler image url: ",ImageHandler.url(url));

    return ImageHandler.url(url);
  };

  $scope.checkStyleMasterName = function(name){
    if(name == undefined || name == '' || name == 0){
      $scope.emptyNameMsg = true;
      document.getElementById("name").focus();
    }else{
      $scope.emptyNameMsg = false;
    }
  }
  $scope.selectedType=[];
  $scope.selectedMeasurementType=function(product){
    if($scope.selectedType.length==0)
         return '';
   else{
    var temp=[];
    for(i=0;i<$scope.selectedType.length;i++){
      if(product.name === $scope.selectedType[i])
           return product;
    }
    return '';
  }
  }

    // $scope.images='';

    // storing product type
    $scope.selectedProductType;
    $scope.contrast = [];
   $scope.showProductType=function(type){
     console.log("select product type is calling..",type);
      console.log("selected product type is ", $scope.luxire_product_type_id);
      var id=$scope.luxire_product_type_id;
      $scope.selectedProductType=$scope.luxire_product_type_id;
        console.log('prod type change', $scope.newProductType);
        $scope.loading= true;
        styleMasterService.getProductTypeById(id).then(function(data) {
        var tempContrast=[];
        $scope.loading= false;
        $scope.allMeasurementType = data.data.luxire_product_attributes;
        $scope.bodyMeasurement = data.data.luxire_product_attributes.body_measurement_attributes; // 28th march add this line
        if(data.data.luxire_product_attributes.personalization_attributes[1].value == undefined){
            console.log("no contrast attribute is there...");
        }else{
          for(var key in data.data.luxire_product_attributes.personalization_attributes[1].value){
              var tempObj={};
              console.log("key : ",key);
              tempObj["name"]=key;
              tempObj["value"]='';
              tempObj["rule"]=[];
              $scope.contrast.push(tempObj);
          }
          console.log("\n\ncontrast object is: \n\n",$scope.contrast);
          //$scope.selectedProductType = data.data.product_type;
          //console.log("selected product type value is \n",$scope.allMeasurementType);
          $scope.loading= false;

        }

      }, function(info){
        console.log(info);
          $scope.loading= false;

      });

   }

   // monogram portion start
    $scope.showMonogram = false;
    $scope.monogram = {};
    $scope.showMonogramOption = function(monogramStatus){
          if(monogramStatus == true){
            $scope.showMonogram = true;
          }else{
            $scope.showMonogram = false;
          }
    }

   // monogram portiopn end
   // contrast portion start
   var tagIdsObj=[];

   $scope.loadItems = function(query){

     return productSearch.searchProducts(query);

   };
   $scope.tagsInputChange = function(product){
     console.log("in tagsInputChange fun product: ",product);
   }


   // contrast portiopn end


   $scope.default_values={};
   var customization_attributes={};
   var personalization_attributes={};
   //personalization_attributes["contrast"]={};
   var standard_measurement_attributes={};
   var body_measurement_attributes={};

   $scope.showMeasurementType=function(key,name,value){
     console.log("select measurement type is calling.. : ");
     console.log("key: "+key);
     console.log("name: "+name);
     console.log("value: ",value);
     if(key == 'customization'){
        customization_attributes[name]=value;

     }else if(key == 'personalization'){
       var obj={};
       var obj={
         "id": name[0].id,
         "name": name[0].name
       }
        // var obj={};
        // obj["id"] = name[0].id;
        // obj["name"] = name[0].name;
       //personalization_attributes[name] = obj;
          value.push(obj);

      }else if(key == 'standard'){

       standard_measurement_attributes[name] = value;

     }else if(key == 'body'){
       var obj={"key": name, "value": value};
       body_measurement_attributes[name] = obj;

     }
     $scope.default_values["customization_attributes"]=customization_attributes;
     $scope.default_values["personalization_attributes"]=personalization_attributes;
     $scope.default_values["standard_measurement_attributes"]=standard_measurement_attributes;
     //$scope.default_values["body_measurement_attributes"]=body_measurement_attributes;
     console.log("****** default values *******\n\n",$scope.default_values);
   }

   $scope.save=function(){
     //$scope.loading= true;
          console.log("\n\nbefore creating the style master contrast value is: \n\n",$scope.contrast);
        if($scope.newProductType.name == undefined || $scope.newProductType.name == '' || $scope.newProductType.name == 0){
            $scope.alerts.push({type: 'danger', message: 'Name Field Can Not Be Empty !'});
            document.getElementById("name").focus();
        }
        else if($scope.style_image == '' || $scope.style_image == undefined){
          $scope.alerts.push({type: 'danger', message: 'Image Field Can Not Be Empty !'});
          document.getElementById("mandatory_image").focus();
        }

        else{
           $scope.default_values["customization_attributes"]=customization_attributes;
           $scope.default_values["personalization_attributes"]=personalization_attributes;
           $scope.default_values["standard_measurement_attributes"]=standard_measurement_attributes;
           $scope.default_values["body_measurement_attributes"]=$scope.bodyMeasurement;
           $scope.default_values["personalization_attributes"]["monogram"] = $scope.monogram;
           $scope.default_values["personalization_attributes"]["contrast"] = $scope.contrast;

           console.log("new product type :\n",$scope.newProductType);
           console.log("default_values: \n",$scope.default_values);

           $scope.newProductType["default_values"]=$scope.default_values;
           $scope.newProductType["luxire_product_type_id"]=parseInt($scope.selectedProductType);

           console.log(" before posting the new product type obj is  :\n",$scope.newProductType);
           console.log(" before posting the new product type obj is  :\n",JSON.stringify($scope.newProductType));

           styleMasterService.createStyleMaster($scope.newProductType).then(function(data){
             console.log("style master id:", data.data.id);
                //$scope.loading= false;
                styleMasterService.update_image($scope.style_image,data.data.id).then(function(data){
                      console.log("in stylemasterservice.update image image data:",$scope.style_image);
                      console.log("update image upload"); // 30th march
                },function(error) {
                   console.log(error);

                 });
                $scope.alerts.push({type: 'success', message: 'Style Master Created Successfully !'});

                $timeout(function() {
                  console.log("timeout functionality...");
                  $state.go("admin.styleMasterHome");
                }, 3000);


            }, function(info) {
              console.log(info);
              $scope.alerts.push({type: 'danger', message: 'Style Master Creation failed !'});

            })

     }


   }



});
