angular.module('luxire')
.controller('editCollectionController',function($scope, collections,fileReader,products,$http,$interval,$state,$stateParams){
  $scope.imgshow=true;
  $scope.datepicker='';
  $scope.rule = [];
  var tagIdsObj=[];
  var tagIds=[];
  $scope.taxonTitle='';
  $scope.taxonDesc='';
  $scope.save_collection_button=false;
  $scope.flag=true;
  $scope.taxonomiesId=1;
  $scope.showTaxonName='';
  //$scope.product_ids=[];
  //
    console.log("state params: "+$stateParams.id);
    collections.getTaxonsById($scope.taxonomiesId,$stateParams.id).then(function(res){
       console.log("edited taxons value is\n\n",res);
       $scope.showTaxonName=res.data.name;
       $scope.taxonTitle=res.data.name;
       $scope.taxonDesc=res.data.description;
       $scope.rule = res.data.products;
     }, function(info) {
       console.log(info);
     })
  //

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
      // var product_ids=[];
      // var x = products.searchProducts(query);
      // console.log("-----------------------");
      // tagIdsObj.push(x);
      // console.log("query\n\n",tagIdsObj);
      // console.log("rule :",$scope.rule);
      // console.log("rule id: ",$scope.rule.id);
      // angular.forEach($scope.rule, function (product, key) {
      //   console.log('angularforeach val', product);
      //   product_ids.push(product.id);
      // })
      // console.log("ids \n",product_ids);
      // console.log("-----------------------");
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
    console.log('angularforeach val', product);
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
          "parent_id": 1,
          "taxonomy_id": 1,
          "product_ids": product_ids
        }
    }
 collections.updateTaxons($scope.id, $scope.tid, updatedTaxonObj).then(function(data){
    alert('taxons updated successfully..');
    $scope.showTaxonName=data.name;
    $scope.taxonTitle=data.name;
    $scope.taxonDesc=data.description;
    console.log("updated data: ",data);
    console.log("-----------------------");
    //$scope.activeButton('products')
  }, function(info) {
    alert("error: updating taxons");
    console.log(info);
  })
}




});
