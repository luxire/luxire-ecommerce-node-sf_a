angular.module('luxire')
.controller('manualSaveCollectionController',function($scope, collections,fileReader,products,$http,$interval){


$scope.tagTitle='';
$scope.tagDesc='';
$scope.id=2;
$scope.createTaxon=function(){
  console.log("tag name: \n"+$scope.tagTitle);
  console.log("tag name: \n"+$scope.tagDesc);


    $scope.taxonObj={
      "taxon":{
            "name": $scope.tagTitle,
            "pretty_name": $scope.tagTitle,
            "description": $scope.tagDesc,
            "parent_id": 2,
            "taxonomy_id": 2
          }
      }
    console.log($scope.id,$scope.taxonObj);
   collections.createTaxons($scope.id,$scope.taxonObj).then(function(data){
      //alert('taxon created successfully....');
      console.log("taxon created sucessfully..");
            //$scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
}

});
