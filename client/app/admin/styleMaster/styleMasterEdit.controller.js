angular.module('luxire')
.controller('styleMasterEditController',function($scope, $state, $timeout, styleMasterService, $state,$stateParams, ImageHandler, productSearch){
  $scope.styleMasterByIdValue='';
  $scope.newProductType='';
  $scope.selectedType=[];
  $scope.allMeasurementType=[];
  $scope.productType='';
  $scope.values={};
  $scope.loading = false;
   var productTypeId='';
   $scope.monogramJson = '';
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
    console.log(url);
    console.log(ImageHandler.url(url));
    return ImageHandler.url(url);
  };

  /*Image upload*/
  // style master functionality

  $scope.customizeDefault=[];
  $scope.personalizeDefault=[];
  $scope.standardDefault=[];
  $scope.bodyDefault=[];
  $scope.body={};
  //$scope.contrast_collor=[];

  $scope.loadItems = function(query){
    console.log();
    return productSearch.searchProducts(query);

  };
  $scope.bodyMeasurement=[]; //28th march add this line
  $scope.contrastJson = [];
  console.log(" in style master edit state params: "+$stateParams.id);
  styleMasterService.getStyleMasterById($stateParams.id).then(function(data){
     $scope.loading = true; // 29th march
     console.log("style master value is\n\n",data.data);
    console.log("image url",ImageHandler.url(data.data.image));
     $('#style_master_img').attr('src', ImageHandler.url(data.data.image));
    //  delete data.data.image;

     $scope.styleMasterByIdValue=data.data;
     $scope.newProductType=data.data;
     $scope.values = data.data.default_values;
     var id= data.data.luxire_product_type.id;
     $scope.contrastjson = data.data.default_values.personalization_attributes.contrast; // 29th march
     $scope.monogramJson = data.data.default_values.personalization_attributes.monogram;
     $scope.body =  data.data.default_values.body_measurement_attributes;
     $scope.bodyMeasurement = data.data.default_values.body_measurement_attributes;
     //$scope.body = data.data.default_values.body_measurement_attributes.body;
     console.log("\n\nbody object is : \n\n",$scope.body);
     $scope.showMonogramVal=true;
     $scope.showMonogram = true;
     console.log("monogram values: ",$scope.monogramJson);
     console.log("+++ default values in style master by id fun +++\n\n",$scope.values);

     //$scope.productType=data.data.luxire_product_type.product_type;
     //productTypeId=data.data.luxire_product_type.id;
     console.log("product id : "+productTypeId);
     console.log("product type: "+$scope.productType);

          styleMasterService.getProductTypeById(id).then(function(data) {
          //$scope.loading= false;
          $scope.allMeasurementType = data.data.luxire_product_attributes;
          console.log("all measurement type value is: ",$scope.allMeasurementType);
          //$scope.selectedProductType = data.data.product_type;
          //console.log("selected product type value is \n",$scope.allMeasurementType);

        }, function(info){
          console.log(info);
        });

        for(var key in data.data.default_values){
          console.log("key val is: "+key);
          if(key == 'customization_attributes'){
            var value = data.data.default_values[key];
            for(var nestedkey in value){
              console.log("c object: ",value[nestedkey]);
               $scope.customizeDefault.push({ name: nestedkey, value: value[nestedkey]});
               //$scope.customizeDefault.push(value[nestedkey]);

            }
          }else if(key == 'personalization_attributes'){
            // var value = data.data.default_values[key];
            //  var value = data.data.default_values[key];
            // for(var nestedkey in value){
            //   console.log("key: ",nestedkey);
            //   console.log("value: ",value[nestedkey]);
            //   if(nestedkey != 'monogram'){
            //     value[nestedkey].selected=true;
            //     var obj={"text": value[nestedkey].name};
            //     //$scope.contrast_collor.push(obj);
            //     //console.log("contrast_collor: ",$scope.contrast_collor);
            //     console.log("tags obj:",obj);
            //     $scope.personalizeDefault.push({ name: nestedkey, id:value[nestedkey].id, value: obj });
            //   }
            //    $scope.personalizeDefault.push(value[nestedkey]);
            //
            //  }
            for(i=0;i<data.data.default_values.personalization_attributes.contrast.length; i++){
              if(data.data.default_values.personalization_attributes.contrast[i].rule != null){
                data.data.default_values.personalization_attributes.contrast[i].selected=true;
              }else{
                data.data.default_values.personalization_attributes.contrast[i].selected=false;
              }
            }
           }else if(key == 'standard_measurement_attributes'){
            var value = data.data.default_values[key];
            for(var nestedkey in value){
              console.log("c object: ",value[nestedkey]);
               $scope.standardDefault.push({ name: nestedkey, value: value[nestedkey]});
               //$scope.standardDefault.push(value[nestedkey]);
          }
        }
      }
        //$scope.selectedCustomizeValue = $scope.customizeDefault[1];
        console.log("**********customization arr: \n\n",$scope.customizeDefault);
        console.log("**********personalization arr: \n\n",$scope.personalizeDefault);
        console.log("**********standard arr: \n\n",$scope.standardDefault);
        //console.log("**********body arr: \n\n",$scope.bodyDefault);
        $scope.loading = false; // 29th march

    },function(info){
     console.log(info);
     $scope.loading = true; // 29th march

   });



  $scope.fun= function(type,name, value){
    console.log("----------------------------\nfun is calling...");
    console.log("name: "+name);
    console.log("type: "+type);
    console.log("value: "+value);
    if(type == 'customization attributes'){
    for(i=0; i<$scope.customizeDefault.length; i++){
      if($scope.customizeDefault[i].name == name){
        console.log("customize value :"+$scope.customizeDefault[i] );
        console.log("fun value :"+value );
        console.log("---------------------------------");
        return true;
      }
    }
  }else if(type == 'personalization attributes'){
    // var pname;
    // var tagsObj=[];
    // for(i=0; i<$scope.personalizeDefault.length; i++){
    //   if($scope.personalizeDefault[i].name == name){
    //     pname = $scope.personalizeDefault[i].name;
    //     tagsObj.push($scope.personalizeDefault[i].value);
    //     angular.forEach($scope.allMeasurementType.personalization_attributes[1].value,function(key, value){
    //
    //       if(value == pname){
    //           console.log("value pname: "+value+"  "+pname);
    //           key.selected = true;
    //           console.log("key val: ",key);
    //           key.rule = tagsObj;
    //           console.log("rule: ",key.rule);
    //       }
    //     })
    //     return true;
    //   }
    // }

  }else if(type == 'standard measurement attributes'){
    for(i=0; i<$scope.standardDefault.length; i++){
      if($scope.standardDefault[i].name == name){
        console.log("customize value :"+$scope.standardDefault[i] );
        console.log("fun value :"+value );
        console.log("---------------------------------");
        return true;
      }
    }
  }
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

  $scope.showMeasurementType=function(key,name,value){
    console.log("select measurement type is calling.. : ");
    console.log("key: "+key);
    console.log("name: "+name);
    console.log("value: "+value);
    if(key == 'customization'){
       $scope.values.customization_attributes[name]=value;

    }else if(key == 'personalization'){
      console.log("call personalization...");
    //$scope.values.personalization_attributes[name]=value;
        // var obj={};
        // obj["id"] = name[0].id;
        // obj["text"] = name[0].name;
        // value.push(obj);
        var obj={
          "id": name[0].id,
          "name": name[0].name
        }
        value.push(obj);

    }else if(key == 'standard'){
      $scope.values.standard_measurement_attributes[name]=value;

    }
    console.log("****** default values *******\n\n",$scope.values);
  }

  $scope.checkStyleMasterName = function(name){  // 29th march add this functionality
    if(name == undefined || name == '' || name == 0){
      $scope.emptyNameMsg = true;
      document.getElementById("name").focus();
    }
  }

  $scope.save=function(){
    if($scope.newProductType.name == undefined || $scope.newProductType.name == '' || $scope.newProductType.name == 0){
        $scope.alerts.push({type: 'danger', message: 'Name Field Can Not Be Empty !'});
        document.getElementById("name").focus();
    }else{
      console.log("in save default values are\n",$scope.values);
      //console.log("new product type :\n",$scope.newProductType);
      //console.log("default_values: \n",$scope.default_values);
      console.log("before posting the monogram object is: ",$scope.monogramJson);
      $scope.values["personalization_attributes"]["monogram"]= $scope.monogramJson;
      $scope.values["body_measurement_attributes"]= $scope.bodyMeasurement;
      $scope.values["personalization_attributes"]["contrast"] = $scope.contrastjson;
      console.log("before update contrast obj: ",$scope.contrastjson);


      $scope.newProductType["default_values"]=$scope.values;
      //$scope.newProductType["luxire_product_type"]='';
       delete $scope.newProductType.image;
      console.log("before posting the the default values are: ",$scope.values);

      console.log(" before posting the new product type obj is  :\n",JSON.stringify($scope.newProductType));
      styleMasterService.updateStyleMasterById($stateParams.id,$scope.newProductType).then(function(data){
        console.log("image value:",$scope.style_image);
        styleMasterService.update_image($scope.style_image,data.data.id).then(function(data){

               },function(error) {
                   console.log(error);

        });
        $scope.alerts.push({type: 'success', message: 'Style Master Updated Successfully !'});
        $timeout(function() {
          console.log("timeout functionality...");
          $state.go("admin.styleMasterHome");
        }, 3000);
       }, function(info) {
         console.log(info);
       })

    }

  }


});
