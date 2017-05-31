angular.module('luxire')
  .controller('editCollectionController', function ($scope, $timeout, taxonImageUpload, ImageHandler, collections, fileReader, products, $http, $interval, $state, $stateParams, $window, $filter) {
    $scope.imgshow = true;
    $scope.loading = true;
    $scope.datepicker = '';
    $scope.rule = [];
    var tagIdsObj = [];
    var tagIds = [];
    $scope.taxonTitle = '';
    $scope.taxonDesc = '';
    $scope.save_collection_button = false;
    $scope.flag = true;
    $scope.sortList='';
    $scope.showTaxonName = '';
    var id = $stateParams.id;
    var tid = $stateParams.taxonomy_id;
    collections.getTaxonsById($stateParams.id, $stateParams.taxonomy_id).then(function (data) {
      // $scope.loading = true;
      $scope.showTaxonName = data.data.name;
      $scope.taxon = data.data;
      $scope.taxonTitle = data.data.name;
      $scope.taxonDesc = data.data.description;
      $scope.rule = data.data.products;
      $scope.image = data.data.icon;
      $scope.tagsArray = [];

      $scope.sortOptions = ["Manually", "Alphabetically A-Z", "Alphabetically Z-A", "By price - highest to lowest", "By price - lowest to highest", "By date - Newest to oldest", "By date - Oldest to newest"]

      collections.getAllProductNames(data.data.product_ids).then(function (data) {
        $scope.tagsArray = data.data;
      })

      $scope.loading = false;
    }, function (info) {
      console.log(info);
      $scope.loading = false;
    })

    // Upload image
    $scope.upload_image = function (files) {
      if (files && files.length) {
        $scope.image = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#style_master_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(files[0]);
      }
    }

    $scope.getImage = function (url) {
      return ImageHandler.url(url);
    };

    // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
    $scope.alerts = [];
    var alert = function () {
      this.type = '';
      this.message = '';
    };
    $scope.close_alert = function (index) {
      $scope.alerts.splice(index, 1);
    };

    // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------

    $scope.activeSaveCollectionBtn = function () {
      $scope.save_collection_button = true;
    }
    $scope.imgShow = function () {
      $scope.imgshow = false;
    }

    $scope.uploadSponsorLogo = function (files) {
      if (files && files.length) {
        $scope.sponsorLogoFileName = files[0].name
        fileReader.readAsDataUrl(files[0], $scope).then(function (result) {
          $scope.productImage = result;
        })
      }
    }

    $scope.loadItems = function (query) {
      return products.searchProducts(query);
    };

    $scope.showUpdatedTaxon = function () {
      collections.getTaxonsById($stateParams.id).then(function (res) {
        $scope.showTaxonName = res.data.name;
        $scope.taxonTitle = res.data.name;
        $scope.taxonDesc = res.data.description;
      }, function (info) {
      })
    }

    // Edit taxon service
    $scope.editTaxon = function (taxon) {
      $scope.loading = true;
      var product_ids = [];
      var product_name = [];
      angular.forEach($scope.rule, function (product, key) {
        product_ids.push(product.id);
      })

      $scope.updatedTaxonObj = {
        "taxon": {
          "id": $stateParams.id,
          "name": $scope.taxonTitle,
          "pretty_name": $scope.taxonTitle,
          "description": $scope.taxonDesc,
          "taxonomy_id": $stateParams.taxonomy_id,
        }
      }
      if ($scope.image && ($scope.image instanceof Array) && $scope.image.length > 0) {
        $scope.updatedTaxonObj.taxon.icon = $scope.image[0];
      }

      collections.updateTaxons(taxon.taxonomy_id, taxon.id, $scope.updatedTaxonObj).then(function (data) {
        $scope.showTaxonName = data.name;
        $scope.taxonTitle = data.name;
        $scope.taxonDesc = data.description;
        $scope.image = data.icon;
        $scope.loading = false;
        $scope.alerts.push({ type: 'success', message: 'Taxons Updated successfully!' });
        $timeout(function () {
          $state.go("admin.collectionHome");
        }, 7000);
      }, function (info) {
        $scope.loading = false;
        $scope.alerts.push({ type: 'danger', message: 'Error Updating Taxons!' });
        console.log(info);
      })
    }

    $( "#sortable" ).sortable({
    start: function(event, ui) {
        ui.item.startPos = ui.item.index();
    },
    stop: function(event, ui) {
       $scope.alerts.push({ type: 'success', message: ' Position changed from '+ui.item.startPos+ ' to ' +ui.item.index()});
       $scope.$apply();
        // console.log("Start position: " + ui.item.startPos);
        // console.log("New position: " + ui.item.index());
    }
});

$scope.listChanged = function(option){
  if(option === 'Manually'){
    console.log("Manual");
  }
  else if(option === 'Alphabetically A-Z'){
    console.log("A to Z");
    $scope.tagsArray = $filter('orderBy')($scope.tagsArray,'name');
  }
  else if(option === 'Alphabetically Z-A'){
    console.log("Z to A");
    $scope.tagsArray = $filter('orderBy')($scope.tagsArray,'-name');
  }
}
  });
