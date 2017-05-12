angular.module('luxire')

.controller('addProductController',function($scope, products, ImageHandler, allTaxons, luxireProperties, luxireVendor, fileReader, fileUpload, prototypeObject, $uibModal, $log, createProductModalService, $state, csvFileUpload){

  $scope.productData  = new prototypeObject.product();
  $scope.product = {};//store the details of the new product
  $scope.luxireProduct = {};//Temporary object to store the new product details


  // --------------------------   START ANGULAR ALERT FUNCTIONALITY    -------------------------
  $scope.alerts = [];//contains the alert messages
  var alert = function(){
    this.type = '';
    this.message = '';
  };
  $scope.close_alert = function(index){
    console.log(index);
    $scope.alerts.splice(index, 1);
  };

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------
  // --------------------------  17th march change-3 START GET ALL PRODUCTS TO SHOW    -------------------------
 // $scope.masterSearchJson;
 $scope.loading = true; // 28th march
  var totalTaxons;//Temporary variable which contains the taxons details
  $scope.seasonTagsArr = [];//store the season details 
  $scope.selectedSeasonArr = [];//Temporary variable which contains the selected seasons
  $scope.colorTagsArr = [];//store the color details 
  $scope.selectedColorArr = [];//Temporary variable which contains the selected colors
  $scope.usageTagsArr = [];//store the fabric usage details
  $scope.selectedUsageArr = [];//Temporary variable which contains the selected fabric usage
  $scope.washCareTagsArr = [];//store the wash care details 
  $scope.selectedWashCareArr = [];//Temporary variable which contains the selected washcare details
  $scope.salesPitchTagsArr = [];//store the sales sales_pitch
  $scope.selectedSalesPitchArr = [];//Temporary variable which contains the selected sales pitch details
  $scope.tagTagsArr = [];//store the tag details
  $scope.selectedTagsArr = [];//Temporary variable which contains the selected tags details
  // start 5th april  of reconfigure the add product controller default loading properties
//get the taxon details
      allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
          $scope.loading = true;
        $scope.taxonsJson = data.data;
        totalTaxons = data.data.count;
        allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
          $scope.allTaxonsJson = data.data.taxons;
        }, function(info){
          console.log(info);
        })

        // default luxire properties
        luxireProperties.luxirePropertiesIndex().then(function(data) {
          $scope.luxireProperties = data.data;
          console.log($scope.luxireProperties);
          var tempArr=[];
          var tempObj={};
          for(i=0; i<$scope.luxireProperties.length; i++){
            if($scope.luxireProperties[i].name == 'season'){
              tempArr = $scope.luxireProperties[i].value.split(',');
                 for(var j=0;j<tempArr.length; j++){
                     tempObj = {"text": tempArr[j]}
                     $scope.seasonTagsArr.push(tempObj);
                 }

            }else if($scope.luxireProperties[i].name == 'color'){
              tempArr = $scope.luxireProperties[i].value.split(',');
                 for(var j=0;j<tempArr.length; j++){
                     tempObj = {"text": tempArr[j]}
                     $scope.colorTagsArr.push(tempObj);
                 }

            }else if($scope.luxireProperties[i].name == 'usage'){
              tempArr = $scope.luxireProperties[i].value.split(',');
                 for(var j=0;j<tempArr.length; j++){
                     tempObj = {"text": tempArr[j]}
                     $scope.usageTagsArr.push(tempObj);
                 }

            }else if($scope.luxireProperties[i].name == 'wash-care'){
              tempArr = $scope.luxireProperties[i].value.split(',');
                 for(var j=0;j<tempArr.length; j++){
                     tempObj = {"text": tempArr[j]}
                     $scope.washCareTagsArr.push(tempObj);
                 }

            }else if($scope.luxireProperties[i].name == 'sales_pitch'){
              tempArr = $scope.luxireProperties[i].value.split(',');
                 for(var j=0;j<tempArr.length; j++){
                     tempObj = {"text": tempArr[j]}
                     $scope.salesPitchTagsArr.push(tempObj);
                 }

            }else if($scope.luxireProperties[i].name == 'tags'){
              tempArr = $scope.luxireProperties[i].value.split(',');
                 for(var j=0;j<tempArr.length; j++){
                     tempObj = {"text": tempArr[j]}
                     $scope.tagTagsArr.push(tempObj);
                 }

            }
          }
        }, function(info){
          console.log(info);
        })

        // default luxire properties


        // default vendor master
        luxireVendor.getAllLuxireVendor().then(function(data) {

          $scope.luxireVendor = data.data;

        }, function(info){
          console.log(info);
        })

        //default vendor master

        // default product TYPES
        products.allProductType().then(function(data) {
          $scope.allproductType=data.data;
        }, function(info){
          console.log(info);
        })
        //default product types
        // stop the loading spring
              $scope.loading = false;
      }, function(info){
        console.log(info);
      })


  // --------------   START OF TAGS INPUT DECLARATION   ---------------

  $scope.colorTags = [];
  $scope.seasonTags = [];
  $scope.colorTagsArr = [];
  $scope.rule=[];
  $scope.taxon_ids=[];

  $scope.loadItems = function($query){
    var filteredArr=[];
    filteredArr = $scope.allTaxonsJson;
    return filteredArr.filter(function(tag){
      return tag.pretty_name.toLowerCase().indexOf($query.toLowerCase()) != -1;
    });

  };
//used to populate the tag array details(color,season,usage,washcare) by returning them
  $scope.loadAutocomplete = function($query,pattern) {
 
    var filteredArr=[];
    if (pattern == 'color') {

      filteredArr = $scope.colorTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'season') {

      filteredArr = $scope.seasonTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'usage') {

      filteredArr = $scope.usageTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'washCare') {

      filteredArr = $scope.washCareTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'salesPitch') {

      filteredArr = $scope.salesPitchTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'tags') {
      filteredArr = $scope.tagTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }
   return {};
 }

 // start: IMPLEMENTATION OF RELATED FABRIC SECTION
    $scope.rule=[];
    $scope.loadRelatedFabric = function(query){
        return products.searchProducts(query);
    }

  // end: IMPLEMENTATION OF RELATED FABRIC SECTION

 // --------------   END OF TAGS INPUT DECLARATION   ---------------


  // --------------------------   END GET ALL PRODUCTS TO SHOW    -------------------------
  /*Image upload*/
  $scope.upload_image = function(files){
    if (files && files.length) {
      $scope.style_image = files[0];
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#product_img').attr('src', e.target.result);
       }

       reader.readAsDataURL(files[0]);
    }
  }

  $scope.getImage = function(url){
    return ImageHandler.url(url);
  };

  // --------------------------   START GET ALL PRODUCT TYPES TO SHOW    -------------------------

	$scope.showProductType=function(){
		 productTypeId=$scope.luxireProduct.luxire_product_type_id;
	}
  // --------------------------   END GET ALL PRODUCT TYPES TO SHOW    -------------------------



  // --------------------------   START GET ALL PRODUCTS TO SHOW    -------------------------


  //controller function for file reader
  $scope.uploadSponsorLogo = function(files) {
          if (files && files.length) {
          $scope.sponsorLogoFileName = files[0].name
          fileReader.readAsDataUrl(files[0], $scope).then(function(result) {
          $scope.productImage = result;
					console.log("image-url: "+$scope.productImage);
        })
      }
    }

  $scope.uploadFile = function(files){
    if (files && files.length) {
      fileUpload.upload(files[0]);
          console.log('files to upload',files[0]);
    }
  }

  $scope.swatchPrice=1;
	$scope.modalCount=0;
	$scope.animationsEnabled = true;

  $scope.luxireStock='';
	$scope.parentSkuStatus='';
	$scope.parentSkuFalseCount=0;
	var productTypeId='';
	var parentSkuObj='';

  // --------------------------   START CHECK PARENT SKU STATUS   -------------------------

  $scope.checkParentSku=function(sku){
    console.log("checkParentSku fun is calling 1...");
    var parentSku={
      parent_sku: sku,
    }
    createProductModalService.checkParentSku(parentSku).then(function(res){
       $scope.parentSkuStatus=res.msg;
       if($scope.parentSkuStatus == "false") {
             $scope.alerts.push({type: 'danger', message: 'Inventory Does Not Exists!\nCreate The Inventory! '});
             $scope.openModal('lg');
					 parentSkuObj = parentSku;
					 $scope.parentSkuFalseCount=0;
       }else{
				 $scope.parentSkuStatus=true;
         $scope.luxireStock=res;
				 $scope.parentSkuFalseCount=0;
				 parentSkuObj = $scope.luxireStock;
          $scope.alerts.push({type: 'success', message: 'Inventory Exists.'});

       }

     }, function(info) {
       console.log(info);
     })

  }
  // --------------------------   END CHECK PARENT SKU STATUS   -------------------------

  // --------------   START OF OPEN MODAL FUNCTIONALITY TO UPLOAD CSV FILE    ---------------

	$scope.importModal=function(size){
		var importCsvModalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'importCsvModal.html',
			controller: 'importCsvModalController',
			size: size,
			resolve: {
				importValue: function () {
					return {name: "rajib" };
				}
			}
		});
		importCsvModalInstance.result.then(function (res) {
		$scope.importModalValue = res;
		var len=JSON.stringify($scope.importModalValue).length;
		var csvToJsonData = CSV2JSON($scope.importModalValue);
		var data=JSON.parse(csvToJsonData);

		csvFileUpload.uploadCsvFile(res).then(function(data) {

	  }, function(info){
	    console.log(info);
	  })


	}, function () {
		$log.info('Modal dismissed at: ' + new Date());
	});

	}
  // --------------   END OF OPEN MODAL FUNCTIONALITY TO UPLOAD CSV FILE    ---------------

  // --------------   START OF OPEN MODAL FUNCTIONALITY TO SHOW THE INVENTORY    ---------------

  $scope.openModal = function (size) {
    $scope.modalCount++;
    if($scope.modalCount>=1){
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'createProductInventoryModal.html',
        controller: 'createProductInventoryModalController',
        size: size,
        resolve: {
          luxireStock: function () {
            return { count:$scope.modalCount, parent_sku_obj: $scope.luxireProduct.parent_sku, sku_status:$scope.parentSkuStatus };
          }
        }
      });
    }else{
			console.log("parent sku object: ",parentSkuObj);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'createProductInventoryModal.html',
        controller: 'createProductInventoryModalController',
        size: size,
        resolve: {
          luxireStock: function () {
            return {count:$scope.modalCount, data: $scope.luxireStock, parent_sku_obj:parentSkuObj, sku_status:$scope.parentSkuStatus};
          }
        }
      });
    }


    modalInstance.result.then(function (luxireStock) {
      $scope.luxireStock = luxireStock;
			$scope.parentSkuFalseCount++;
      products.createInventory(luxireStock).then(function (data) {
        $scope.alerts.push({ type: 'success', message: 'Inventory created Successfully' });
      }, function (error) {
        console.log(error);
      });
    }, function () {

    });
  };
  // --------------   END OF OPEN MODAL FUNCTIONALITY TO SHOW THE INVENTORY    ---------------


 // start of bind the all taxons value



 // end of bind the all taxons value
 // ---------------- START OF THE OPEN MODAL FUNCTIONALITY TO SHOW THE DATE PICKER ----------------

  //This is datapicker 
  $scope.datePicker = new Date();
  //This function is to display the date in custom format as dd/mm/yyyy
  $scope.dateFunction = function (date) {
    var dt = date.getDate();
    var month = date.getMonth() + 1;//January is 0 that's y month value is incremented
    var year = date.getFullYear();
    $scope.date = dt + '/' + month + '/' + year;
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
  //------------------------- END OF THE DATE PICKER MODAL FUNCTIONALITY ------------------

 // --------------   START OF CREATING THE PRODUCT STRUCTURE TO POST    ---------------

    $scope.checkShippingCatgoryId = function(shippingId){ // 23rd march changes: add this function
      $scope.shipping_emp_msg = false;
      if(shippingId == '' || shippingId == undefined){
        $scope.shipping_emp_msg = true;
      }else{
        $scope.shipping_emp_msg = false;
      }
    }
  	$scope.createProduct = function() {
        // start: 18th march change: put validation for mandatory fields
        var empty_state_flag = 0;
      if(!empty_state_flag){
          if( $scope.product.name == '' || $scope.product.name == undefined){
            $scope.alerts.push({type: 'danger', message: 'Product Name Can Not Be Empty !'});
            document.getElementById("title").focus();
            return;
          }
           if($scope.luxireProduct.parent_sku == '' || $scope.luxireProduct.parent_sku == undefined){
            $scope.alerts.push({type: 'danger', message: 'Parent Sku Can Not Be Empty !'});
            document.getElementById('parentSku').focus();
            return;
          }
           if($scope.product.slug == '' || $scope.product.slug == undefined){
            $scope.alerts.push({type: 'danger', message: 'Slug Can Not Be Empty !'});
            document.getElementById('slug').focus();
            return;
          }
           if($scope.product.shipping_category_id == '' || $scope.product.shipping_category_id == undefined){
            $scope.alerts.push({type: 'danger', message: 'Shipping Category Id Can Not Be Empty !'});
            document.getElementById('shipping_category_id').focus();
            return;
          }
           if($scope.product.price == '' || $scope.product.price == undefined){
            $scope.alerts.push({type: 'danger', message: 'Product Price Can Not Be Empty !'});
            document.getElementById('price').focus();
            return;
          }
           if($scope.luxireProduct.luxire_product_type_id == undefined || $scope.luxireProduct.luxire_product_type_id == ''){
            $scope.alerts.push({type: 'danger', message: 'product Type Can Not Be Empty !'});
            document.getElementById('productType').focus();
            return;
          }
           if($scope.luxireProduct.luxire_vendor_master_id == undefined || $scope.luxireProduct.luxire_vendor_master_id == ''){
            $scope.alerts.push({type: 'danger', message: 'Product Vendor Can Not Be Empty !'});
            document.getElementById('vendor').focus();
            return;
          }
           if($scope.product.sku == undefined || $scope.product.sku== ''){
            $scope.alerts.push({type: 'danger', message: 'Product Sku Can Not Be Empty !'});
            document.getElementById('productSku').focus();
            return;
          }
           if ($scope.luxireProduct.length_required == undefined || $scope.luxireProduct.length_required == '') {
        $scope.alerts.push({ type: 'danger', message: 'Product length_requried canot be Empty !' });
        document.getElementById('lengthRequired').focus();
        return;
      }
          empty_state_flag = 1;
    }
        if(empty_state_flag){ // 21st march
        // end: 18th march change: put validation for mandatory fields
        var tagarr=[];
        if( $scope.selectedTagsArr == undefined || $scope.selectedTagsArr.length == 0 ){

        }else{
          for(i=0;i<$scope.selectedTagsArr.length;i++){
            tagarr[i]=$scope.selectedTagsArr[i].text;
          }
        }

        var colorArr=[];
        if($scope.selectedColorArr == undefined || $scope.selectedColorArr.length == 0 ){

        }else{
          for(i=0;i<$scope.selectedColorArr.length;i++){
            colorArr[i]=$scope.selectedColorArr[i].text;
          }
        }

        var seasonArr=[];
        if( $scope.selectedSeasonArr == undefined || $scope.selectedSeasonArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedSeasonArr.length;i++){
            seasonArr[i]=$scope.selectedSeasonArr[i].text;
          }
        }
        var usageArr=[];
        if( $scope.selectedUsageArr == undefined || $scope.selectedUsageArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedUsageArr.length;i++){
            usageArr[i]=$scope.selectedUsageArr[i].text;
          }
        }
        var washCareArr=[];
        if( $scope.selectedWashCareArr == undefined || $scope.selectedWashCareArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedWashCareArr.length;i++){
            usageArr[i]=$scope.selectedWashCareArr[i].text;
          }
        }
        var salesPitchArr=[];
        if( $scope.selectedSalesPitchArr == undefined || $scope.selectedSalesPitchArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedSalesPitchArr.length;i++){
            salesPitchArr[i]=$scope.selectedSalesPitchArr[i].text;
          }
        }
        for(var i=0;i<$scope.rule.length;i++){
          $scope.taxon_ids[i]=$scope.rule[i].id;
        }
    		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
        $scope.luxireProduct["product_tags"]=tagarr.toString(); // storing the tags input values entered
        $scope.luxireProduct["product_color"]=colorArr.toString();  // storing the color tags input values entered
        $scope.luxireProduct["suitable_climates"]=seasonArr.toString(); // storing the seasons tags input values entered
        $scope.luxireProduct["usage"]=usageArr.toString(); // storing the seasons tags input values entered
        $scope.luxireProduct["wash_care"]=washCareArr.toString(); // storing the seasons tags input values entered
        $scope.luxireProduct["sales_pitch"]=salesPitchArr.toString(); // storing the seasons tags input values entered


  		if($scope.parentSkuStatus==true){   // creating product for existing parent_sku
  				$scope.postProductData={};
        $scope.postProductData["product"] = {};
        $scope.postProductData["product"]["name"] = $scope.product.name;
        $scope.postProductData["product"]["price"] = $scope.product.price.toString();
        $scope.postProductData["product"]["shipping_category_id"] = $scope.product.shipping_category_id;
        $scope.postProductData["product"]["luxire_product_type_id"] = $scope.luxireProduct.luxire_product_type_id;
        $scope.postProductData["product"]["luxire_vendor_master_id"] = $scope.luxireProduct.luxire_vendor_master_id;
        $scope.postProductData["product"]["sku"] = $scope.product.sku;
        $scope.postProductData["product"]["luxire_product_attributes"] = $scope.luxireProduct;
        $scope.postProductData["product"]["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxireStock.id;
        $scope.postProductData["product"]["available_on"] = $scope.date;
          // first create product functionality is invoked
        	products.createProduct($scope.postProductData).then(function(data){
            products.update_image_variant(data.master.id,$scope.style_image).then(function(data){
            },function(error) {
               console.log(error);

             });
           
            $scope.alerts.push({type: 'success', message: 'Product Created Successfully!'});
             $state.go('admin.product');
  		    }, function(info) {
  		      console.log("creating product error:\n\n",info);
  		    })
         
  		}else{ // creating product for non existing parent_sku
      $scope.luxireStock["parent_sku"]=$scope.luxireProduct.parent_sku;
      if (JSON.stringify($scope.luxireStock).length === 2) {
              $scope.alerts.push({type: 'success', message: 'Create the inventory first..!'});
              //alert("luxire stock is empty...");
      }else{
  		$scope.postProductData={};
  		// merge all the three product structure
  		$scope.luxireStock["virtual_count_on_hands"]=$scope.luxireStock.physical_count_on_hands;
  		$scope.product["luxire_product_attributes"] = {};
      $scope.product["taxon_ids"] = $scope.taxon_ids;
  		$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  		$scope.product["luxire_product_attributes"]["luxire_stock_attributes"] = $scope.luxireStock;

  		$scope.postProductData["product"]=$scope.product;

  		$scope.modalCount=0;
      products.createProduct($scope.postProductData).then(function(data){

          $scope.alerts.push({type: 'success', message: 'Product created successfully!'});
          // $scope.activeButton('products');
        }, function(info) {
          console.log(info);
        })

      }
    }
  }// 21st march
}


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
