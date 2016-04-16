angular.module('luxire')
.controller('collectionHomeController',function($scope, collections,allTaxons,fileReader,products,$http,$interval,$state,$stateParams){
$scope.loading= true;
$scope.allTaxonomies='';





  // collections.getCollections().then(function(data) {
  //   $scope.loading= false;
  //   console.log("values of all taxonomies\n\n");
  //   $scope.allTaxonomies=data;
  //   console.log(data.data.taxonomies[0].root.taxons);
  //
  // }, function(info){
  //   console.log(info);
  // })
  var totalTaxons;
  allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
    $scope.taxonsJson = data.data;
    console.log("all taxons per page: ",$scope.taxonsJson);
    $scope.loading = false;
    totalTaxons = data.data.count;
    allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
      $scope.allTaxonsJson = data.data.taxons;
      console.log("total taxons are: ",$scope.allTaxonsJson);
      $scope.loading = false;
    }, function(info){
      console.log(info);
    })
  }, function(info){
    console.log(info);
  })



$scope.deleteTaxons=function(id, index){
    $scope.delTaxonomieId=1;
    $scope.delTaxonsId=id;
    console.log("deleted taxon id: \n"+id);
   collections.deleteTaxons($scope.delTaxonomieId, $scope.delTaxonsId).then(function(data){
      $scope.allTaxonomies.data.taxonomies[0].root.taxons.splice(index,1);
      alert('taxons deleted successfully...');
      //$scope.activeButton('products')
    }, function(info) {
      console.log(info);
    })
}

$scope.showEditTaxons=function(id){
  console.log("taxon params id in home: "+id);
  $state.go("admin.editCollections",{id: id});
}
});
