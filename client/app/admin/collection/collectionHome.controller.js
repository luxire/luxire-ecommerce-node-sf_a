angular.module('luxire')
  .controller('collectionHomeController', function ($scope, collections, ImageHandler, allTaxons, fileReader, products, $http, $interval, $state, $stateParams, $uibModal, $location, $timeout, $window) {
    $scope.loading = true;
    $scope.allTaxonomies = '';
    $scope.masterTaxonsJson;
    $scope.alerts = [];
    var alert = function () {
      this.type = '';
      this.message = '';
    };
    $scope.close_alert = function (index) {
      $scope.alerts.splice(index, 1);
    };
    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };

    var totalTaxons = 50;
    // fetching all taxons
    allTaxons.getTaxonsPerPage(totalTaxons).then(function (data) {
      $scope.taxonsJson = data.data;
      $scope.loading = false;
      totalTaxons = data.data.count;
      // taxons being fetched per page 
      allTaxons.getTaxonsPerPage(totalTaxons).then(function (data) {
        $scope.allTaxonsJson = data.data.taxons;
        $scope.masterTaxonsJson = $scope.allTaxonsJson;
        $scope.loading = false;
      }, function (info) {
        console.log(info);
      })
    }, function (info) {
      console.log(info);
    })

    $scope.searchTaxonsJson;
    $scope.noCollectionMsg = false;
    // search bar - on key up searching for taxons
    $scope.searchTaxonsByQuery = function (query, event) {
      $scope.loading = true;
      if (event.keyCode >= 65 && event.keyCode <= 90) {
        allTaxons.searchTaxons(query).then(function (data) {
          $scope.searchTaxonsByQueryJson = data.data.taxons;
          $scope.masterTaxonsJson = $scope.searchTaxonsByQueryJson;
          if ($scope.masterTaxonsJson.length == 0) {
            $scope.noCollectionMsg = true;
          } else {
            $scope.noCollectionMsg = false;
          }
          $scope.loading = false;
        }, function (info) {
          console.log("error: ", info);
          $scope.loading = true;
        })
      }
      else {
        if (query.length == 0) {
          $scope.masterTaxonsJson = $scope.allTaxonsJson;
          $scope.loading = false;
        }
      }
    }

    
    $scope.showEditTaxons = function (taxons) {  
      $state.go("admin.editCollections", { id: taxons.id, taxonomy_id: taxons.taxonomy_id });
    }

// Deleting taxons - modal popup
    $scope.deleteTaxons = function (taxon, index) {
      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'delete_collection.html',
        controller: 'DeleteCollectionController',
        size: 'md',
        backdrop: 'static',
        resolve: {
          taxon: function () {
            return taxon;
          }
        }
      })
      modalInstance.result.then(function (taxon) {
        $scope.loading = false;
        $window.location.reload();
        $scope.alerts.push({ type: 'success', message: 'Deleted Collections ' + taxon.name + ' successfully!' });
      },
        $timeout(function () { 
          $state.go("admin.collectionHome");
        }, 3000),
        function () {
        });
    }
  })

// Controller for deletion of taxon
  .controller('DeleteCollectionController', function ($scope, $uibModalInstance, taxon, collections) {
    $scope.taxon = taxon;
    $scope.delete = function () {
      $scope.loading = true;
      // calling delete taxons from service
      collections.deleteTaxons(taxon.id, taxon.taxonomy_id).then(function (data) {
        $scope.loading = false;
        $uibModalInstance.close(taxon);
      }, function (error) {
        console.log(error);
        $scope.loading = false;
        $scope.alerts.push({ type: 'danger', message: 'Deletion failed!' });
      })
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
      $window.location.reload();
    };
  })
