angular.module('luxire')
.controller('editCollectionController',function($scope,$timeout,taxonImageUpload, ImageHandler, collections,fileReader,products,$http,$interval,$state,$stateParams){
  $scope.imgshow=true;
  $scope.loading = true;

  $scope.datepicker='';
  $scope.rule = [];
  var tagIdsObj=[];
  var tagIds=[];
  $scope.taxonTitle='';
  $scope.taxonDesc='';
  $scope.save_collection_button=false;
  $scope.flag=true;
  //$scope.taxonomiesId=1;
  $scope.showTaxonName='';
  //$scope.product_ids=[];
  //
    console.log("state params taxonomie_id: "+$stateParams.taxonomie_id); //18th march changes  @rajib
    console.log("state params taxons_id: "+$stateParams.taxons_id);  //18th march changes  @rajib


    collections.getTaxonsById($stateParams.taxonomie_id,$stateParams.taxons_id).then(function(res){  // //18th march changes in the argument  @rajib
       $scope.loading = true;
       console.log("edited taxons value is\n\n",res);
       console.log("image url",ImageHandler.url(res.data.image));
        $('#style_master_img').attr('src', ImageHandler.url(res.data.icon));
       $scope.showTaxonName=res.data.name;
       $scope.taxonTitle=res.data.name;
       $scope.taxonDesc=res.data.description;
       $scope.rule = res.data.products;
       $scope.loading = false;
     }, function(info) {
       console.log(info);
       $scope.loading = true;
     })


     // image upload functionality
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


     // end image upload functionality
  //
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

  $scope.activeSaveCollectionBtn=function(){
      $scope.save_collection_button=true;
  }
  $scope.imgShow=function(){

      $scope.imgshow=false;
  }

  $scope.uploadSponsorLogo = function(files) {
          if (files && files.length) {
          $scope.sponsorLogoFileName = files[0].name
          fileReader.readAsDataUrl(files[0], $scope).then(function(result) {
          $scope.productImage = result;

        })
      }
    }

    $scope.loadItems = function(query){
      console.log("serched products are: ",products.searchProducts(query));
      return products.searchProducts(query);
    };

$scope.showUpdatedTaxon=function(){
  collections.getTaxonsById($scope.taxonomiesId,$stateParams.id).then(function(res){
     console.log("updated taxons value is\n\n",res);
     $scope.showTaxonName=res.data.name;
     $scope.taxonTitle=res.data.name;
     $scope.taxonDesc=res.data.description;
   }, function(info) {
     console.log(info);
   })
}

$scope.editTaxon=function(){
  console.log("-----------------------");
  $scope.id=1;
  $scope.tid=$stateParams.id;
  var product_ids=[];
  var product_name=[];
  angular.forEach($scope.rule, function (product, key) {
  //  console.log('angularforeach val', product);
    product_ids.push(product.id);
  })

  console.log("product_ids\n",product_ids);
  console.log("before update name:\n",$scope.showTaxonName);
  console.log("before update title:\n",$scope.taxonTitle);
  console.log("before update desc:\n",$scope.taxonDesc);
  var updatedTaxonObj={

    "taxon":{
          "name": $scope.taxonTitle,
          "pretty_name": $scope.taxonTitle,
          "description": $scope.taxonDesc,
          "taxonomy_id": $stateParams.taxonomie_id,
          "product_ids": product_ids
        }
    }
    //delete $scope.newProductType.i;

 collections.updateTaxons($stateParams.taxonomie_id, $stateParams.taxons_id, updatedTaxonObj).then(function(data){
    $scope.showTaxonName=data.name;
    $scope.taxonTitle=data.name;
    $scope.taxonDesc=data.description;
    console.log("updated data: ",data);
    // updating image upload functionality
    taxonImageUpload.update_image($scope.style_image,$stateParams.taxonomie_id,data.id).then(function(data){
           console.log("update image fun is calling after taxon creation...");
          console.log("in collection .update image image data:",$scope.style_image);
          console.log("update image upload"); // 30th march
    },function(error) {
       console.log(error);

     });

    $scope.alerts.push({type: 'success', message: 'Taxons Updated successfully!'});
    $timeout(function() {
      console.log("timeout functionality...");
      $state.go("admin.collectionHome");
    }, 3000);
    //$scope.activeButton('products')
  }, function(info) {
    $scope.alerts.push({type: 'success', message: 'Error Updating Taxons!'});
    //alert("error: updating taxons");
    console.log(info);
  })
}




});
