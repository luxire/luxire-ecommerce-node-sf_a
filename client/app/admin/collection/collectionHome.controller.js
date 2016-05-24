angular.module('luxire')
.controller('collectionHomeController',function($scope, collections,ImageHandler, allTaxons,fileReader,products,$http,$interval,$state,$stateParams){
$scope.loading= true;
$scope.allTaxonomies='';
$scope.masterTaxonsJson;


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
$scope.getImage = function(url){
  console.log(ImageHandler.url(url));
  return ImageHandler.url(url);
};
// --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------


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
      $scope.masterTaxonsJson = $scope.allTaxonsJson;
      console.log("total taxons are: ",$scope.masterTaxonsJson);
      $scope.loading = false;
    }, function(info){
      console.log(info);
    })
  }, function(info){
    console.log(info);
  })
  // 17th march change-5 implement taxons search by name

  $scope.searchTaxonsJson;
  $scope.noCollectionMsg = false; // 18th march
  $scope.searchTaxonsByQuery = function(query,event){
        $scope.loading = true;
        console.log("query: ",query);
        if(event.keyCode == 13){
          allTaxons.searchTaxons(query).then(function(data){
          console.log("search taxons by id data is: ",data.data.taxons);
          $scope.searchTaxonsByQueryJson = data.data.taxons;
          $scope.masterTaxonsJson = $scope.searchTaxonsByQueryJson;
          if($scope.masterTaxonsJson.length == 0){  // 18th march added this condition
            $scope.noCollectionMsg = true;
          }else{
            $scope.noCollectionMsg = false;
          }
          $scope.loading = false;
          console.log("====== search taxons  json is=====: ",$scope.masterTaxonsJson);
        }, function(info){
          console.log("error: ",info);
          $scope.loading = true;
        })
        }else{
          if(query.length == 0){
            console.log("query: ",query);
            $scope.masterTaxonsJson = $scope.allTaxonsJson;
            $scope.loading = false;

          }
        }

  }

  // 17th march change-5 implement taxons search by name




$scope.deleteTaxons=function(taxon, index){  // 22nd march
    console.log("deleted taxon id: \n"+taxon.id);
   collections.deleteTaxons(taxon.taxonomy_id, taxon.id).then(function(data){
      $scope.masterTaxonsJson.splice(index,1);
      $scope.alerts.push({type: 'success', message: 'Taxons Deleted successfully!'});
    }, function(info) {
      console.log(info);
    })
}

$scope.showEditTaxons=function(taxons){  // 18th march changes in this function  @rajib
  console.log("taxon object in home: ",taxons);
  $state.go("admin.editCollections",{taxonomie_id:taxons.taxonomy_id , taxons_id:taxons.id });
}
});
