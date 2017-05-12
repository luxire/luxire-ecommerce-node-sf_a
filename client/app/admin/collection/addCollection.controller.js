angular.module('luxire')
  .controller('addCollectionController', function ($scope, $state, $timeout, taxonImageUpload, ImageHandler, collections, fileReader, products, $http, $interval) {
    $scope.criteria = [];
    $scope.numberOfConditions = "all";
    // default condition
    $scope.conditionselect = "AutomaticSelection";
    $scope.loading = true;
    // default attribute and conditions for automatic selection
    $scope.defaultAttribute = "productTitle";
    $scope.defaultCondition = "isEqualto";
    // Values of product attribute
    $scope.productAttribute = ["Product title", "Product type", "Product vendor", "Product price", "Product tag", "Compare at price", "Weight", "Inventory stock", "Variant's title", "Mill", "Composition", "Technical description", "Suitable climate", "GSM", "Thickness", "Stiffness", "Wash care", "Sales pitch", "Weave type", "Design", "Color"];
    // Values of product condition
    $scope.productCondition = ["is equal to", "is not equal to", "is greater than", "is less than", "starts with", "ends with", "contains", "does not contain", "greater than equals to", "lesser than equals to"];
    $scope.status = {
      isopen1: false,
      isopen2: false
    };
    // Array for integer and string
    ArrayInteger = ["is equal to", "is not equal to", "is greater than", "is less than", "greater than equals to", "lesser than equals to"];
    ArrayString = ["starts with", "ends with", "contains", "does not contain"];
    var productAttributeSelect = {
      "Product title": ArrayString, "Product type": ArrayString, "Product vendor": ArrayString, "Product price": ArrayInteger, "Product tag": ArrayString, "Compare at price": ArrayInteger, "Weight": ArrayInteger,
      "Inventory stock": ArrayInteger, "Variant's title": ArrayString, "Mill": ArrayString, "Material": ArrayString, "Technical description": ArrayString, "Suitable climate": ArrayString, "GSM": ArrayInteger,
      "Thickness": ArrayString, "Stiffness": ArrayInteger, "Wash care": ArrayString, "Sales pitch": ArrayString, "Weave type": ArrayString, "Design": ArrayString, "Color": ArrayString, "no. of color": ArrayInteger
    }

    // Collection object
    var collectionObj = { property: "", criteria: "", value: "" }
    $scope.validationCheck = function () {
      if ($scope.tagtitle == '' || $scope.tagtitle == undefined || $scope.tagtitle == 0) {
        $scope.alerts.push({ type: 'danger', message: 'Name Can Not Be Empty!' });
        document.getElementById("name").focus();
      }
      else if ($scope.selectedTaxonomie == '' || $scope.selectedTaxonomie == undefined || $scope.selectedTaxonomie == 0) {
        $scope.alerts.push({ type: 'danger', message: 'Select a Taxonomy!' });
        document.getElementById("taxons").focus();
      }
    }

    $scope.ArrayList = [collectionObj];
    var ConditionObject = {
      property: "firstAttribute",
      criteria: "firstCondition",
      value: "value"
    }

    $scope.ArrayAdd = function () {
      var collectionObj = { property: "", criteria: "", value: "" }
      $scope.ArrayList.push(collectionObj);
      console.log("$scope.ArrayList--", $scope.ArrayList);
    }

    $scope.DeleteArrayIndex = function (index) {
      $scope.ArrayList.splice(index, 1);
    }

    // Arrays for dropdown
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    $scope.showdate = false;
    $scope.publishDate = new Date();
    $scope.flag = 0;
    var flag = 0;
    $scope.manualCon = false;
    $scope.rule = [];
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    $scope.save_collection_btn = false;
    $scope.tagtitle = '';
    $scope.tagdesc = '';
    $scope.taxonomieJson = '';
    // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
    $scope.alerts = [];
    var alert = function () {
      this.type = '';
      this.message = '';
    };
    $scope.close_alert = function (index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.activeSaveCollectionBtn = function () {
      $scope.save_collection_btn = false;
    }

    $scope.value = '';
    var query;

    $scope.cancel = function () {
      if (angular.isDefined(query)) {
        $interval.cancel(query);
        query = undefined;
      }
    };

    $scope.$on('$destroy', function () {
      $scope.cancel();
    });

    $scope.addConditionArr = [];

    collections.getCollections().then(function (data) {
      $scope.loading = true;
      $scope.taxonomieJson = data.data;
      $scope.loading = false;
    }, function (err) {
      console.log(err);
      $scope.loading = true;
    })

    // create a taxons
    $scope.selectedTaxonomieOption = function (taxonomie_id) {
      $scope.selectedTaxonomieId = taxonomie_id;
    }

    $scope.loadItems = function (query) { //30th march
      return products.searchProducts(query);
    };
    // image upload functionality
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

// create taxons functionality
    $scope.createTaxons = function () {
      $scope.loading = true;
      // radio button for automatic selection
      if ($scope.conditionselect === "AutomaticSelection") {
        var emptyRules = document.getElementById("valueBox").value;
        if (emptyRules == 0 || emptyRules == undefined || emptyRules === '') {
          $scope.loading = false;
          $scope.alerts.push({ type: 'danger', message: 'Please enter the rules' });
        }
        $scope.id = 1;
        var product_ids = [];
        angular.forEach($scope.rule, function (product, key) {
          product_ids.push(product.id);
        })

        $scope.taxonObj = {
          "taxon": {
            "name": $scope.tagtitle,
            "pretty_name": $scope.tagtitle,
            "description": $scope.tagdesc,
            //"product_ids": product_ids,
            "taxonomy_id": $scope.selectedTaxonomieId,
            "rules": $scope.ArrayList,
            "match": $scope.numberOfConditions,
          }
        }
        if ($scope.image && ($scope.image instanceof Array) && $scope.image.length > 0) {
          $scope.taxonObj.taxon.icon = $scope.image[0];
        }

        // calling taxons automatic
        collections.createTaxonsAutomatic($scope.selectedTaxonomieId, $scope.taxonObj).then(function (data) {
          $scope.loading = true;
          collections.update_image($scope.image, $scope.selectedTaxonomieId, data.id).then(function (data) {
          }, function (error) {
            console.log(error);
          });
          $scope.loading = false;
          $scope.alerts.push({ type: 'success', message: 'Taxons created successfully!' });
          $timeout(function () { // 30th march add this function
            $state.go("admin.collectionHome");
          }, 3000);
        }, function (info) {
          $scope.loading = false;
          console.log(info);
        })
      }
      // if radio button selected ia manual
      else if ($scope.conditionselect === "ManualSelection") {
        $scope.id = 1;
        var product_ids = [];
        angular.forEach($scope.rule, function (product, key) {
          product_ids.push(product.id);
        })
        $scope.taxonObj = {
          "taxon": {
            "name": $scope.tagtitle,
            "pretty_name": $scope.tagtitle,
            "description": $scope.tagdesc,
            "product_ids": product_ids,
            "taxonomy_id": $scope.selectedTaxonomieId
          }
        }
        if ($scope.image && ($scope.image instanceof Array) && $scope.image.length > 0) {
          $scope.taxonObj.taxon.icon = $scope.image[0];
        }
        // calling taxon creation for manual functionality
        collections.createTaxons($scope.selectedTaxonomieId, $scope.taxonObj).then(function (data) {
          collections.update_image($scope.image, $scope.selectedTaxonomieId, data.id).then(function (data) {
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
          $scope.loading = false;
          $scope.alerts.push({ type: 'success', message: 'Taxons created successfully!' });
          $timeout(function () { // 30th march add this function
            $state.go("admin.collectionHome");
          }, 3000);
        }, function (info) {
          console.log(info);
        })
      }
    }

    $scope.changeCriteriaContents = function (attribute, index) {
      $scope.criteria[index] = productAttributeSelect[attribute];
    }

    // providing validation for input boxes
    $scope.validate = function () {
      if ($scope.tagtitle == '' || $scope.tagtitle == undefined || $scope.tagtitle == 0) {
        $scope.alerts.push({ type: 'danger', message: 'Name Can Not Be Empty!' });
        $scope.loading = false;
        document.getElementById("name").focus();
      }
      else if ($scope.selectedTaxonomie == '' || $scope.selectedTaxonomie == undefined || $scope.selectedTaxonomie == 0) {
        $scope.loading = false;
        $scope.alerts.push({ type: 'danger', message: 'Select a Taxonomy!' });
        document.getElementById("taxons").focus();
      }
    }
  });
