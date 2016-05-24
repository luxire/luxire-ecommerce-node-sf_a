angular.module('luxire')
.controller('TaxonomyController', function($scope, TaxonomyService, $state,$rootScope,$timeout) {
  $scope.taxonomyData = [];
  /*Alerts to display messages*/
  $rootScope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
  $rootScope.alerts.splice(index, 1);
  };

//Display all the taxonomies
  $scope.loading = true;
  TaxonomyService.getTaxonomies().then(function(data) {
    $scope.taxonomyData = data.data.taxonomies;
    $scope.loading = false;
  }, function(info) {
      console.log(info);
  })

  //Hyperlinks in home which will invoke editpage
    $scope.showEditTaxonomies = function(id) {
      $state.go("admin.editTaxonomy", {id: id});
    }

    //create taxonomy function
    $scope.createTaxonomy = function() {
      if($scope.new_taxonomy_name == '' || $scope.new_taxonomy_name==undefined || $scope.new_taxonomy_name == 0){
        document.getElementById("name").focus();
        $scope.alerts.push({type: 'danger', message: 'Name should not be empty!'});
      }else{
          $scope.new_taxonomy = {
            "name": $scope.new_taxonomy_name
          };
          $scope.taxonomyData.push($scope.new_taxonomy);
          TaxonomyService.createTaxonomy($scope.new_taxonomy).then(function(data) {
            $rootScope.alerts.push({type: 'success', message: 'Taxonomy created successfully!'});
            $timeout(function(){
              $state.go('admin.editTaxonomy', {id: data.data.id});
            }, 3000)
          }, function(error) {
            console.log(error);
            $rootScope.alerts.push({type: 'danger', message: 'Taxonomy Creation Failed!'}); // Changes made on 18th March
          });
      }
  }

    //Delete function
    $scope.deleteTaxonomy = function(id, index) {
      TaxonomyService.deleteTaxonomy(id).then(function(data) {
        $scope.taxonomyData.splice(index, 1);
        $rootScope.alerts.push({type: 'success', message: 'Taxonomy deleted successfully!'});
      }, function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', message: 'Taxonomy Deletion Failed!'});
      })
    }
  })

.controller('editTaxonomyController', function($scope, TaxonomyService, $stateParams, $state, $rootScope,$timeout) {
  console.log("state params id : ", $stateParams.id);
  $scope.taxons = [];

  $rootScope.alerts = [];
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    $rootScope.alerts.splice(index, 1);
  };



  $scope.showEditCollections = function(id) {
    console.log("Id of Taxon: " + id);
    $state.go("admin.editCollections", {taxonomie_id:$stateParams.id, taxons_id: id});
  }
  $scope.loading = true ;
  TaxonomyService.getTaxonomyById($stateParams.id).then(function(data) {
    $scope.taxons = data.data.root.taxons;
    $scope.taxonomyData = data.data.name;
    $scope.loading = false;
  }, function(info) {
    console.log(info);
  })


  $scope.updateTaxonomy = function(id) {
    var updatedTaxonomyObj = {
      "name": $scope.taxonomyData
    }

    console.log("Taxons",$scope.taxons.length);
    if($scope.taxons.length == 0){
      $rootScope.alerts.push({type: 'danger', message: 'Create at least one taxon!'});
    }
    else{
      TaxonomyService.updateTaxonomy($stateParams.id, updatedTaxonomyObj).then(function(data) {
        $rootScope.alerts.push({type: 'success', message: 'Taxonomy updated successfully!'});
        $timeout(function(){
          $state.go('admin.taxonomy');
        }, 3000)
      }, function(error) {
        console.log(error);
        $rootScope.alerts.push({type: 'danger', message: 'Taxonomy updation Failed!'});
      })
    }
  }
})
