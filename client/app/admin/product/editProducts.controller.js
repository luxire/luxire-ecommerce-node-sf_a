var luxire = angular.module('luxire')
luxire.controller('editProductController', function ($scope, $window, $timeout, products, allTaxons, luxireProperties, luxireVendor, fileReader, prototypeObject, $state, $stateParams, $uibModal, $log, editModalService) {
  var formName = "editProductForm";
  $scope.luxire_stock = '';//store the luxire stock details
  $scope.luxire_product = {};//store the luxire product details
  $scope.swatchPrice = 1;
  $scope.tagsArr = [];
  $scope.colorTagsArr = [];
  $scope.usageTagsArr = []; // 24th march add this line
  $scope.washCareTagsArr = []; // 24th march add this line
  $scope.seasonTagsArr = [];
  $scope.salesPitchTagsArr = []; // 24th march add this line
  $scope.rule = [];
  $scope.taxon_ids = [];
  $scope.editedAllTaxonsJson = [];
  $scope.seasonData = [];
  $scope.colorData = [];
  $scope.washCareData = [];
  $scope.usageData = [];
  $scope.salesPitchData = [];
  $scope.tagsData = [];
  $scope.loading = true;
  //This is the array which contains multiple variant images for uploading
  $scope.variant_image = [];
  var elementName = "";

  // ---------------- START OF GET ALL THE PRODUCT DETAILS TO SHOW ---------------------
  products.getProductByID($stateParams.id).then(function (data) {
    $scope.loading = true;
    $scope.products = data;

    setDropdownValues($scope.products.shipping_methods, $scope.products.shipping_category_id, 'shippingMethod');

    //This function is to parse the date to dd/mm/yyyy format
    var convertDate = function (date) {
      var date = date.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})/);
      if (date == null) {
        return false;
      } else {
        var dateObj = {
          dateFormat1: date[3] + '/' + date[2] + '/' + date[1],
          dateFormat2: date[1] + '-' + date[2] + '-' + date[3],
          dateFormat3: date[2] + '/' + date[3] + '/' + date[1],
          time: date[4] + ':' + date[5] + ':' + date[6],
        };
        return dateObj;
      }
    };
    products.allProductType().then(function (data) {
      $scope.allproductType = data.data;
      setDropdownValues($scope.allproductType, $scope.products.luxire_product.luxire_product_type_id, 'productType');
    }, function (info) {
      console.log(info);
    });

    $scope.date = convertDate(data.available_on).dateFormat1;
    p = $scope.products;
    //image_url contains the image URL of the selected product 
    $scope.image_url = [];
    //pushing the image to image_url which is available in the $scope.products objects
    $scope.image_url.push($scope.products.master.images[0]);
    for (var i = 1; i < $scope.products.master.images.length; i++) {
      $scope.variant_image.push($scope.products.master.images[i]);
    }
    //set the master id of the product
    $scope.master_id = $scope.products.master.id;
    $scope.luxire_stock = data.luxire_stock;
    $scope.luxire_product = data.luxire_product;

    //  ***** start:- 28th march changes:  this portion responsiblr for converting attribute value into tags input
    if ($scope.products.luxire_product && $scope.products.luxire_product.product_tags) {
      var arr = $scope.products.luxire_product.product_tags.split(','); // converting the tags array of string into tags input object
      var tagsObj = {};
      for (i = 0; i < arr.length; i++) {
        tagsObj = {
          "text": arr[i]
        };
        $scope.tagsArr.push(tagsObj);
      }
    }
    if ($scope.products.luxire_product && $scope.products.luxire_product.product_color) {
      var colorArr = $scope.products.luxire_product.product_color.split(','); // converting the array of color string into tags input object
      var colorObj = {};
      for (i = 0; i < colorArr.length; i++) {
        colorObj = {
          "text": colorArr[i]
        };
        $scope.colorTagsArr.push(colorObj);
      }
    }
    if ($scope.products.luxire_product && $scope.products.luxire_product.suitable_climates) {
      var seasonArr = $scope.products.luxire_product.suitable_climates.split(','); // converting the array of seasons string into tags input object
      var seasonObj = {};
      for (i = 0; i < seasonArr.length; i++) {
        seasonObj = {
          "text": seasonArr[i]
        };
        $scope.seasonTagsArr.push(seasonObj);
      }
    }
    // start : 24th march add the following if else condition
    if ($scope.products.luxire_product && $scope.products.luxire_product.usage) {
      var usageArr = $scope.products.luxire_product.usage.split(','); // converting the array of seasons string into tags input object
      var usageObj = {};
      for (i = 0; i < usageArr.length; i++) {
        usageObj = {
          "text": usageArr[i]
        };
        $scope.usageTagsArr.push(usageObj);
      }
    }
    //  end : 24th march add the following if else condition
    // start : 24th march add the following if else condition
    if ($scope.products.luxire_product && $scope.products.luxire_product.wash_care) {
      var washCareArr = $scope.products.luxire_product.wash_care.split(','); // converting the array of seasons string into tags input object
      var washCareObj = {};
      for (i = 0; i < washCareArr.length; i++) {
        washCareObj = {
          "text": washCareArr[i]
        };
        $scope.washCareTagsArr.push(washCareObj);
      }
    }
    if ($scope.products.luxire_product && $scope.products.luxire_product.sales_pitch) {
      var salesPitchArr = $scope.products.luxire_product.sales_pitch.split(','); // converting the array of seasons string into tags input object
      var salesPitchObj = {};
      for (i = 0; i < salesPitchArr.length; i++) {
        salesPitchObj = {
          "text": salesPitchArr[i]
        };
        $scope.salesPitchTagsArr.push(salesPitchObj);
      }
    }

    //  ***** start :- 28th march changes:  this portion responsible for fetch luxire properties and convert them into input tags

    luxireProperties.luxirePropertiesIndex().then(function (data) {
      var tempSeasonData = [];
      var tempWashCareData = [];
      var tempColorData = [];
      var tempUsageData = [];
      var tempSalesPitchData = [];
      var tempTagsData = [];

      $scope.luxireProperties = data.data;
      for (var i = 0; i < $scope.luxireProperties.length; i++) {
        if ($scope.luxireProperties[i].name == 'season') {
          tempSeasonData = $scope.luxireProperties[i].value.split(',');
        } else if ($scope.luxireProperties[i].name == 'wash-care') {
          tempWashCareData = $scope.luxireProperties[i].value.split(',');
        } else if ($scope.luxireProperties[i].name == 'color') {
          tempColorData = $scope.luxireProperties[i].value.split(',');
        } else if ($scope.luxireProperties[i].name == 'usage') {
          tempUsageData = $scope.luxireProperties[i].value.split(',');
        } else if ($scope.luxireProperties[i].name == 'sales_pitch') {
          tempSalesPitchData = $scope.luxireProperties[i].value.split(',');
        } else if ($scope.luxireProperties[i].name == 'tags') {
          tempTagsData = $scope.luxireProperties[i].value.split(',');
        }
      }
      var tagObj = {};
      for (var j = 0; j < tempSeasonData.length; j++) {
        tagObj = { "text": tempSeasonData[j] }
        $scope.seasonData.push(tagObj);
      }

      for (var j = 0; j < tempWashCareData.length; j++) {
        tagObj = { "text": tempWashCareData[j] }
        $scope.washCareData.push(tagObj);
      }

      for (var j = 0; j < tempColorData.length; j++) {
        tagObj = { "text": tempColorData[j] }
        $scope.colorData.push(tagObj);
      }

      for (var j = 0; j < tempUsageData.length; j++) {
        tagObj = { "text": tempUsageData[j] }
        $scope.usageData.push(tagObj);
      }

      for (var j = 0; j < tempSalesPitchData.length; j++) {
        tagObj = { "text": tempSalesPitchData[j] }
        $scope.salesPitchData.push(tagObj);
      }

      for (var j = 0; j < tempTagsData.length; j++) {
        tagObj = { "text": tempTagsData[j] }
        $scope.tagsData.push(tagObj);
      }

    }, function (info) {
      console.log(info);
    })


    //  ***** end :- 28th march changes:  this portion responsible for fetch luxire properties and convert them into input tags


  }, function (info) {
    console.log(info);
  }); // 28th march end of get product by id functionality
  // ---------------- END OF GET ALL THE PRODUCT DETAILS TO SHOW ---------------------


  // --------------------------   START GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------


  $scope.loadItems = function ($query) {
    var filteredArr = [];
    filteredArr = $scope.allTaxonsJson;
    return filteredArr.filter(function (tag) {
      return tag.pretty_name.toLowerCase().indexOf($query.toLowerCase()) != -1;
    });
  };
  // ---------------- START OF TAGS INPUT FUNCTIONALITY LOADI---------------------
  $scope.loadAutocomplete = function ($query, pattern) {
    var filteredArr = [];
    if (pattern == 'season') {
      filteredArr = $scope.seasonData;
      return filteredArr.filter(function (tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'washCare') {
      filteredArr = $scope.washCareData;
      return filteredArr.filter(function (tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'color') {
      filteredArr = $scope.colorData;
      return filteredArr.filter(function (tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'usage') {
      filteredArr = $scope.usageData;
      return filteredArr.filter(function (tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'salesPitch') {
      filteredArr = $scope.salesPitchData;
      return filteredArr.filter(function (tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'tags') {
      filteredArr = $scope.tagsData;
      return filteredArr.filter(function (tag) {
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }

  }

  // --------------------------   START GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------

  // --------------------------   START GET ALL LUXIRE VENDORS  TO SHOW    -------------------------

  luxireVendor.getAllLuxireVendor().then(function (data) {
    $scope.luxireVendor = data.data;
    setDropdownValues($scope.luxireVendor, $scope.luxire_product.luxire_vendor_master_id, 'vendor');
    $scope.loading = false;
  }, function (info) {
    console.log(info);
  })
  // --------------------------   END GET ALL LUXIRE VENDORS  TO SHOW    -------------------------

  $scope.modalCount = 0;
  $scope.animationsEnabled = true;
  $scope.dummyInventoryData = '';
  $scope.selectedType = '';

  $scope.luxireStock = '';
  $scope.parentSkuStatus = '';
  $scope.parentSkuFalseCount = 0;
  var productTypeId = '';

  $scope.checkShippingCatgoryId = function (shippingId) { // 23rd march changes: add this function
    $scope.shipping_emp_msg = false;
    if (shippingId == '' || shippingId == undefined) {
      $scope.shipping_emp_msg = true;
    } else {
      $scope.shipping_emp_msg = false;
    }
  }
  $scope.showProductType = function () {
    productTypeId = $scope.newProductType.type;
  }
  // ********************  START OF EDIT INVENTORY MODAL  ************************

  $scope.openModal = function (size) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'editModalContent.html',
      controller: 'editModalInstanceCtrl',
      size: size,
      resolve: {
        luxireStock: function () {
          return { count: $scope.modalCount, data: $scope.products.luxire_stock, product: $scope.products.luxire_product.luxire_stock_id };
        }
      }
    });

    modalInstance.result.then(function (luxireStock) {
      $scope.luxireStock = luxireStock;
      $scope.parentSkuFalseCount++;
      $scope.dummyInventoryData = $scope.luxireStock;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  // ********************  END OF EDIT INVENTORY MODAL  ************************

  // start of bind the all taxons value

  var totalTaxons;
  allTaxons.getTaxonsPerPage(totalTaxons).then(function (data) {
    $scope.taxonsJson = data.data;
    $scope.loading = false;
    totalTaxons = data.data.count;
    allTaxons.getTaxonsPerPage(totalTaxons).then(function (data) {
      $scope.allTaxonsJson = data.data.taxons;
      var obj;
      $scope.loading = false;
    }, function (info) {
      console.log(info);
    })
  }, function (info) {
    console.log(info);
  })
  $scope.uploadFile = function () {
    setTimeout(function () {
      var element = angular.element(document.getElementById('input'));
      element.triggerHandler('click');
      $scope.clicked = true;
    }, 0);
  }

  // ---------------- START OF TAGS INPUT FUNCTIONALITY ---------------------


  // end of bind the all taxons value


  // ********************  START  OF FUNCTIONALTY TO UPDATE A PRODUCT  ************************

  $scope.editProduct = function () {
    if ($scope[formName].$valid) {
      // var taxon_ids = [];
      // for (var i = 0; i < $scope.rule.length; i++) {
      //   taxon_ids[i] = $scope.rule[i].id;
      // }
      $scope.loading = true;
      var tagsarr = []; // start: 24th march
      for (i = 0; i < $scope.tagsArr.length; i++) {
        tagsarr[i] = $scope.tagsArr[i].text;
      }// end: 24th march
      var colorarr = [];
      for (i = 0; i < $scope.colorTagsArr.length; i++) {
        colorarr[i] = $scope.colorTagsArr[i].text;
      }
      var seasonarr = [];
      for (i = 0; i < $scope.seasonTagsArr.length; i++) {
        seasonarr[i] = $scope.seasonTagsArr[i].text;
      }
      var usagearr = []; // start: 24th march
      for (i = 0; i < $scope.usageTagsArr.length; i++) {
        usagearr[i] = $scope.usageTagsArr[i].text;
      }// end: 24th march
      var washCarearr = []; // start: 24th march
      for (i = 0; i < $scope.washCareTagsArr.length; i++) {
        washCarearr[i] = $scope.washCareTagsArr[i].text;
      }// end: 24th march
      var salesPitcharr = []; // start: 24th march
      for (i = 0; i < $scope.salesPitchTagsArr.length; i++) {
        salesPitcharr[i] = $scope.salesPitchTagsArr[i].text;
      }// end: 24th march
      $scope.luxire_product["suitable_climates"] = seasonarr.toString(); // converting the season tags input values into a array of string
      $scope.luxire_product["product_tags"] = tagsarr.toString();   // converting the tags input values into a array of string
      $scope.luxire_product["product_color"] = colorarr.toString();   // converting the color tags input values into a array of string
      $scope.luxire_product["usage"] = usagearr.toString();   // 24th march changes:  add this line
      $scope.luxire_product["wash_care"] = washCarearr.toString();   // 24th march changes:  add this line
      $scope.luxire_product["sales_pitch"] = salesPitcharr.toString();   // 24th march changes:  add this line
      $scope.luxire_product["product_tags"] = tagsarr.toString();

      // merging the product structure
      $scope.product = {};
      $scope.product["name"] = $scope.products.name;
      $scope.product["description"] = $scope.products.description;
      $scope.product["price"] = $scope.products.price;
      $scope.product["display_price"] = $scope.products.display_price;

      $scope.luxireStock["virtual_count_on_hands"] = $scope.luxireStock.physical_count_on_hands;
      $scope.postProductData = {};
      $scope.product["luxire_product_attributes"] = {};
      $scope.product["luxire_product_attributes"] = $scope.luxire_product;
      $scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxire_stock.id;
      //$scope.product["taxon_ids"] = taxon_ids;

      $scope.postProductData["product"] = $scope.product;
      $scope.postProductData["available_on"] = $scope.date;

      // Get the shipping category id from shipping method
      $scope.product.shipping_category_id = $scope.shippingMethod.id;
      $scope.luxire_product.luxire_product_type_id = $scope.productType.id;
      $scope.luxire_product.luxire_vendor_master_id = $scope.vendor.id;

      // call the update product functionality
      products.editProduct($scope.products.id, $scope.postProductData).then(function (data) {
        $scope.loading = false;
        $scope.alerts.push({ type: 'success', message: 'Product Updated successfully!' });

        // $scope.activeButton('products')
      }, function (error) {
        $scope.loading = false;
        handleError(error, $scope);
      })


    } else {
      handleValidationError($scope, formName);
    }
    // ******************** END OF FUNCTIONALTY TO UPDATE A PRODUCT  ************************\


    //This function is used for controlling the modal (getting the image url)
    $scope.modalImage = '';
    $scope.addProduct_variant_image_url = function () {

      var modalInstance = $uibModal.open({
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'myModalContent.html',
        controller: 'editProductVariantModalInstanceCtrl1',
        size: 'lg',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      }
      );
      modalInstance.result.then(function (data) {
        //this is for uploading the image, a service is available for getting this image and sending it to the server modified on 10/03/17
        $scope.loading = true;
        var url = data.items;
        var uploadPromise = products.upload_image_url_variant($scope.products.id, $scope.master_id, data.items)
        uploadPromise.then(function (data) {
          $scope.variant_image.push(url);
          $window.location.reload();
          $scope.loading = false;
          $scope.alerts.push({ type: 'success', message: 'Variant Image Uploaded successfully!' });
        }, function (data) {
          console.log('error', data);
        });
      });
    }
  }
  //This function is used for controlling the modal (getting the image)
  $scope.addProduct_variant_image = function () {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'ModalContent.html',
      controller: 'editProductVariantModalInstanceCtrl2',
      size: 'lg',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    }
    );
    modalInstance.result.then(function (data) {
      $scope.loading = true;
      $scope.modalImage = data.items;
      //this is for uploading the image, a service is available for getting this image and sending it to the server modified on 10/03/17
      var uploadPromise = products.upload_image_variant($scope.products.id, $scope.master_id, data.key)
      uploadPromise.then(function (data) {
        $scope.variant_image.push(data.items);
        $scope.loading = false;
        $scope.alerts.push({ type: 'success', message: 'Variant Image Uploaded successfully!' });
        $window.location.reload();

      }, function (data) {
        $scope.loading = false;
        $scope.alerts.push({ type: 'warning', message: 'Please select an image to upload' });
        console.log('error', data);
      });

    });
  }
  //This is the function which invoke the imageModal.html modal
  $scope.image_modal = function (image) {
    $scope.modalImage = image;
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'imageModal.html',
      windowClass: 'my-dialog',
      controller: 'showProductVariantModalInstanceCtrl1',
      size: 'lg',
      resolve: {
        imageModal: function () {
          return $scope.modalImage;
        }
      }
    })
  }
  //This is the function which invokes the imageDeleteModal.html modal
  $scope.delete_modal = function (a) {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'imageDeleteModal.html',
      controller: 'showProductVariantModalInstanceCtrl2',
      size: 'lg',
      resolve: {
        deleteModal: function () {
          return $scope.variant_image;
        }
      }
    });
    modalInstance.result.then(function (data) {
      $scope.loading = true;
      products.delete_variant_image($scope.products.id, a).then(function (data) {
        $window.location.reload();
        $scope.loading = false;
        $scope.alerts.push({ type: 'success', message: 'Variant Image Deleted successfully!' });
      }, function (error) {
        $scope.loading = false;
        handleError(error, $scope);
      });
    });
  }
  //This is datapicker 
  $scope.datePicker = new Date();
  //This function is to display the date in custom format as dd/mm/yyyy
  $scope.dateFunction = function (date) {
    var dt = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
  }($scope.datePicker);
  //This is the function which invokes the datePickerModal.html modal
  $scope.openDatePicker = function () {
    var modalInstance = $uibModal.open({
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'datePickerModal.html',
      controller: 'showDateModalInstanceCtrl',
      size: 'lg',
      resolve: {
        dateModal: function () {
          return $scope.date;
        }
      }
    });
    modalInstance.result.then(function (data) {
      var dt = data.date.getDate();
      var month = data.date.getMonth() + 1;
      var year = data.date.getFullYear();
      $scope.date = dt + '/' + month + '/' + year;
    })
  }

// setDropdownValues function is used to set the drop down values of shippingMethods, product type, vendor, etc.
  function setDropdownValues(element, selectedId, modalAttribute) {
    element = element || [];

    for (var counter = 0; counter < element.length; counter++) {
      if (selectedId === element[counter].id) {
        $scope[modalAttribute] = element[counter];
        break;
      }
    }

  }
});
//This is myModalContent.html controller
luxire.controller('editProductVariantModalInstanceCtrl1', function ($scope, items, $uibModalInstance, products) {
  $scope.item = items;
  $scope.ok = function (data) {
    $uibModalInstance.close({ key: "closed successfully", items: data });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
//This is ModalContent.html controller
luxire.controller('editProductVariantModalInstanceCtrl2', function ($scope, items, $uibModalInstance, products) {

  $scope.imageUpload = function (event) {
    var files = event.target.files; //FileList object
    for (var i = 0; i < files.length; i++) {
      $scope.imagefile = files[i];
      var file = files[i];
      var reader = new FileReader();
      reader.onload = $scope.imageIsLoaded;
      reader.readAsDataURL(file);
    }
  }
  $scope.imageIsLoaded = function (e) {
    $scope.$apply(function () {
      $scope.product_image = e.target.result;
    });
  }
  $scope.item = items;
  $scope.ok = function () {
    $uibModalInstance.close({ key: $scope.imagefile, items: $scope.product_image });
    $scope.loading = true;
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

//This is the imageModal.html controller
luxire.controller('showProductVariantModalInstanceCtrl1', function ($scope, $uibModalInstance, products, imageModal) {
  $scope.modalImage = imageModal;
  $scope.ok = function () {
    $uibModalInstance.close();
  };
});

//This is the imageDeleteModal.html controller
luxire.controller('showProductVariantModalInstanceCtrl2', function ($scope, $uibModalInstance, products, deleteModal) {
  $scope.ok = function () {
    $uibModalInstance.close({ key: "closed successfully", image_url: deleteModal });
  };
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

//This is the datePickerModal.html controller
luxire.controller('showDateModalInstanceCtrl', function ($scope, $uibModalInstance, dateModal) {
  $scope.$watch('date1', function (n, o) {
    $scope.date1 = n;
  })
  $scope.ok = function () {
    $uibModalInstance.close({ date: $scope.date1 });
  }
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  }
})


