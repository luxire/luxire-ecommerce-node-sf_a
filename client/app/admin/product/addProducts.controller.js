angular.module('luxire')

.controller('addProductController',function($scope, products, ImageHandler, allTaxons, luxireProperties, luxireVendor, fileReader, fileUpload, prototypeObject, $uibModal, $log, createProductModalService, $state, csvFileUpload){

  $scope.productData  = new prototypeObject.product();
  $scope.product = {};
  $scope.luxireProduct = {};


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

  // --------------------------   END ANGULAR ALERT FUNCTIONALITY    -------------------------
  // --------------------------  17th march change-3 START GET ALL PRODUCTS TO SHOW    -------------------------
  $scope.masterSearchJson;
  $scope.loading = true; // 28th march
  var totalTaxons;
  $scope.seasonTagsArr=[];
  $scope.selectedSeasonArr=[];
  $scope.colorTagsArr=[];
  $scope.selectedColorArr=[];
  $scope.usageTagsArr=[];
  $scope.selectedUsageArr=[];
  $scope.washCareTagsArr=[];
  $scope.selectedWashCareArr=[];
  $scope.salesPitchTagsArr=[];
  $scope.selectedSalesPitchArr=[];
  $scope.tagTagsArr=[];
  $scope.selectedTagsArr=[];
  // start 5th april  of reconfigure the add product controller default loading properties

      allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
          $scope.loading = true;
        $scope.taxonsJson = data.data;
        console.log("all taxons per page: ",$scope.taxonsJson);
        // $scope.loading = false;
        totalTaxons = data.data.count;
        //$scope.loading = false;
        allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
          $scope.allTaxonsJson = data.data.taxons;
          console.log("total taxons are: ",$scope.allTaxonsJson);
        }, function(info){
          console.log(info);
        })

        // default luxire properties
        luxireProperties.luxirePropertiesIndex().then(function(data) {
          console.log('admin luxire properties values are ...');
          //console.log(data);
          $scope.luxireProperties = data.data;
          //$scope.loading = false;
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
          console.log("type of properties: ",typeof($scope.luxireProperties[0]));
          // var arr=$scope.luxireProperties[0].value.split(',');
          // console.log("arr\n\n",arr);
        }, function(info){
          console.log(info);
        })

        // default luxire properties


        // default vendor master
        luxireVendor.getAllLuxireVendor().then(function(data) {
          console.log('admin luxire vendor values are ...\n\n');
          //console.log(data);
          $scope.luxireVendor = data.data;
          //$scope.loading = false;
          console.log($scope.luxireVendor);
        }, function(info){
          console.log(info);
        })

        //default vendor master

        // default product TYPES
        products.allProductType().then(function(data) {
          //$scope.loading= false;
          console.log("values of all product type \n\n");
          $scope.allproductType=data.data;
          console.log("\n\nall product type values are \n\n",data.data);

        }, function(info){
          console.log(info);
        })


        //default product types

        // stop the loading spring
              $scope.loading = false;
      }, function(info){
        console.log(info);
      })



  // end  of reconfigure the add product controller default loading properties

  // products.getProducts().then(function(data) {
  //     $scope.loading = true; //28th march
  //     $scope.jsonresponse = data.data.products;
  //     $scope.masterSearchJson = $scope.jsonresponse;
  //     allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
  //       $scope.taxonsJson = data.data;
  //       console.log("all taxons per page: ",$scope.taxonsJson);
  //       // $scope.loading = false;
  //       totalTaxons = data.data.count;
  //       //$scope.loading = false;
  //       allTaxons.getTaxonsPerPage(totalTaxons).then(function(data) {
  //         $scope.allTaxonsJson = data.data.taxons;
  //         console.log("total taxons are: ",$scope.allTaxonsJson);
  //       }, function(info){
  //         console.log(info);
  //       })
  //     }, function(info){
  //       console.log(info);
  //     })
  //
  //     luxireProperties.luxirePropertiesIndex().then(function(data) {
  //       console.log('admin luxire properties values are ...');
  //       //console.log(data);
  //       $scope.luxireProperties = data.data;
  //       //$scope.loading = false;
  //       console.log($scope.luxireProperties);
  //       var tempArr=[];
  //       var tempObj={};
  //       for(i=0; i<$scope.luxireProperties.length; i++){
  //         if($scope.luxireProperties[i].name == 'season'){
  //           tempArr = $scope.luxireProperties[i].value.split(',');
  //              for(var j=0;j<tempArr.length; j++){
  //                  tempObj = {"text": tempArr[j]}
  //                  $scope.seasonTagsArr.push(tempObj);
  //              }
  //
  //         }else if($scope.luxireProperties[i].name == 'color'){
  //           tempArr = $scope.luxireProperties[i].value.split(',');
  //              for(var j=0;j<tempArr.length; j++){
  //                  tempObj = {"text": tempArr[j]}
  //                  $scope.colorTagsArr.push(tempObj);
  //              }
  //
  //         }else if($scope.luxireProperties[i].name == 'usage'){
  //           tempArr = $scope.luxireProperties[i].value.split(',');
  //              for(var j=0;j<tempArr.length; j++){
  //                  tempObj = {"text": tempArr[j]}
  //                  $scope.usageTagsArr.push(tempObj);
  //              }
  //
  //         }else if($scope.luxireProperties[i].name == 'wash-care'){
  //           tempArr = $scope.luxireProperties[i].value.split(',');
  //              for(var j=0;j<tempArr.length; j++){
  //                  tempObj = {"text": tempArr[j]}
  //                  $scope.washCareTagsArr.push(tempObj);
  //              }
  //
  //         }else if($scope.luxireProperties[i].name == 'sales_pitch'){
  //           tempArr = $scope.luxireProperties[i].value.split(',');
  //              for(var j=0;j<tempArr.length; j++){
  //                  tempObj = {"text": tempArr[j]}
  //                  $scope.salesPitchTagsArr.push(tempObj);
  //              }
  //
  //         }else if($scope.luxireProperties[i].name == 'tags'){
  //           tempArr = $scope.luxireProperties[i].value.split(',');
  //              for(var j=0;j<tempArr.length; j++){
  //                  tempObj = {"text": tempArr[j]}
  //                  $scope.tagTagsArr.push(tempObj);
  //              }
  //
  //         }
  //       }
  //       console.log("type of properties: ",typeof($scope.luxireProperties[0]));
  //       var arr=$scope.luxireProperties[0].value.split(',');
  //       console.log("arr\n\n",arr);
  //     }, function(info){
  //       console.log(info);
  //     })
  //
  //     luxireVendor.getAllLuxireVendor().then(function(data) {
  //       console.log('admin luxire vendor values are ...\n\n');
  //       //console.log(data);
  //       $scope.luxireVendor = data.data;
  //       //$scope.loading = false;
  //       console.log($scope.luxireVendor);
  //     }, function(info){
  //       console.log(info);
  //     })
  //
  //     products.allProductType().then(function(data) {
  //   		//$scope.loading= false;
  //   		console.log("values of all product type \n\n");
  //   		$scope.allproductType=data.data;
  //   		console.log("\n\nall product type values are \n\n",data.data);
  //
  //   	}, function(info){
  //   		console.log(info);
  //   	})
  //
  //     $scope.loading = false;
  //
  //
  // }, function(info){
  //   console.log(info);
  // })

  //--------- START OF SHOWING THE PUBLISH DATE ----------
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  $scope.showdate=false;
  $scope.publishDate = new Date();
  var dateFlag=0;

  $scope.showDate=function(){
    //if($scope.publishDate != null){
    var dateObj=$scope.publishDate;
    console.log("dateobj: "+dateObj);
    $scope.hrs=dateObj.getHours();
    $scope.mnt=dateObj.getMinutes();
    $scope.sec=dateObj.getSeconds();
    $scope.dt=dateObj.getDate();
    $scope.yr=dateObj.getFullYear();
    $scope.mon=months[dateObj.getMonth()];
    $scope.day=days[dateObj.getDay()];
    console.log("date : "+$scope.day+" "+$scope.dt+" "+$scope.mon+" "+$scope.yr+"\n");
    console.log("time : "+$scope.hrs+" : "+$scope.mnt+" : "+$scope.sec);
  //}
    if(dateFlag==0){
      dateFlag++;
    }else{
      $scope.showdate=true;
    }
  }


  //--------- END OF SHOWING THE PUBLISH DATE ----------
  // --------------   START OF TAGS INPUT DECLARATION   ---------------

  $scope.colorTags = [];
  $scope.seasonTags = [];
  //$scope.tagsarr = [];
  $scope.colorTagsArr = [];
  $scope.rule=[];
  $scope.taxon_ids=[];

  $scope.loadItems = function($query){
    var filteredArr=[];
    //return $scope.allTaxonsJson;
    filteredArr = $scope.allTaxonsJson;
    return filteredArr.filter(function(tag){
      return tag.pretty_name.toLowerCase().indexOf($query.toLowerCase()) != -1;
    });

  };


  $scope.loadAutocomplete = function($query,pattern) {
    //console.log("query is: ",$query);
    var filteredArr=[];
    if (pattern == 'color') {
      //return $scope.colorTagsArr;
      filteredArr = $scope.colorTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    } else if (pattern == 'season') {
      // return $scope.seasonTagsArr;
      filteredArr = $scope.seasonTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'usage') {
      //return $scope.usageTagsArr;
      filteredArr = $scope.usageTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'washCare') {
      //return $scope.washCareTagsArr;
      filteredArr = $scope.washCareTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'salesPitch') {
      //return $scope.salesPitchTagsArr;
      filteredArr = $scope.salesPitchTagsArr;
      return filteredArr.filter(function(tag){
        return tag.text.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    }else if (pattern == 'tags') {
      //console.log("tags arr: ",$scope.tagTagsArr);
      //return $scope.tagTagsArr;
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
      //var tempproduct=products.searchProducts(query);
        //console.log("temp producct: \n",tempproduct);
        return products.searchProducts(query);
    }

  // end: IMPLEMENTATION OF RELATED FABRIC SECTION

 // --------------   END OF TAGS INPUT DECLARATION   ---------------


  // --------------------------   END GET ALL PRODUCTS TO SHOW    -------------------------

  // $scope.upload_product_image = function(files){
  //   console.log('product image', files[0]);
  //   if (files && files.length) {
  //     $scope.product_image = files[0];
  //     var reader = new FileReader();
  //      reader.onload = function (e) {
  //          $('#product_image').attr('src', e.target.result);
  //      }
  //
  //      reader.readAsDataURL(files[0]);
  //     // fileUpload.upload(files[0]);
  //         console.log('files to upload',files[0]);
  //   }
  // }
  //
  // $scope.post_image = function(){
  //   products.add_variant_image(24, 34, $scope.product_image)
  //   .then(function(data){
  //     console.log(data);
  //   }, function(error){
  //     console.error(error);
  //   });
  // };
  /*Image upload*/
  $scope.upload_image = function(files){
    console.log('typeof', typeof(files[0]));
    console.log('product image', typeof(files[0]));
    if (files && files.length) {
      $scope.style_image = files[0];
      console.log('files to upload',files[0]);
      var reader = new FileReader();
       reader.onload = function (e) {
           $('#product_img').attr('src', e.target.result);
       }

       reader.readAsDataURL(files[0]);
    }
  }

  $scope.getImage = function(url){
    //console.log(url);
    console.log("_______________image handler image url: ",ImageHandler.url(url));

    return ImageHandler.url(url);
  };

  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();
  $scope.maxDate = new Date(2020, 5, 22);

  $scope.open = function($event) {
    $scope.status.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

  $scope.status = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 2);
  $scope.events =
    [
      {
        date: tomorrow,
        status: 'full'
      },
      {
        date: afterTomorrow,
        status: 'partially'
      }
    ];

  $scope.getDayClass = function(date, mode) {
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i=0;i<$scope.events.length;i++){
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  };


  // --------------------------   START GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------

    // --------------------------   END GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------
    // --------------------------   START GET ALL LUXIRE VENDORS  TO SHOW    -------------------------


  // --------------------------   END GET ALL LUXIRE PROPERTIES  TO SHOW    -------------------------
  // --------------------------   START GET ALL PRODUCT TYPES TO SHOW    -------------------------

	$scope.showProductType=function(){
		 //console.log("select product type is calling..");
		 //console.log("selected product type is "+$scope.newProductType.type);
		 productTypeId=$scope.luxireProduct.luxire_product_type_id;
		 console.log("selected product type id: "+productTypeId);

	}
  // --------------------------   END GET ALL PRODUCT TYPES TO SHOW    -------------------------


  // -------------------------- 17TH MARCH  change-1 PRODUCT SEARCH FUNCTIONALITY    -------------------------

  // $scope.searchProductsJson;
  // $scope.noProductMsg = false; // 18th march
  // $scope.searchProductByQuery = function(query){
  //   $scope.loading = true;
  //   if(query.length>=1){
  //     products.searchProducts(query).then(function(data){
  //       $scope.searchProductsByQueryJson = data;
  //       $scope.masterSearchJson = $scope.searchProductsByQueryJson;
  //       $scope.loading = false;
  //       if($scope.masterSearchJson.length == 0){  // 18th march
  //         $scope.noProductMsg = true;
  //       }else{
  //         $scope.noProductMsg = false;
  //       }
  //       console.log("====== search products json is=====: ",$scope.masterSearchJson);
  //     }, function(info){
  //       console.log("error: ",info);
  //     })
  //   }else if(query.length == 0){
  //     console.log("query.length == 0");
  //     //$scope.loading = true;
  //     $scope.masterSearchJson = $scope.jsonresponse;
  //     $scope.loading = false;
  //
  //   }
  //
  // }

  // --------------------------   17TH MARCH change-1 PRODUCT SEARCH FUNCTIONALITY    -------------------------






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

  // $scope.deleteProducts = function(id,index) {
  //   products.deleteProduct(id).then(function(data){
  //     $scope.alerts.push({type: 'success', message: 'Product deleted successfully!'});
	// 		$scope.jsonresponse.data.products.splice(index,1);
  //     //alert('Product deleted successfully');
  //     $scope.activeButton('products')
  //   }, function(info) {
  //     console.log(info);
  //   })
  // }

  $scope.swatchPrice=1;
	$scope.modalCount=0;
	$scope.animationsEnabled = true;
	$scope.dummyInventoryData='';
  $scope.pid='';


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
       //console.log(" parent sku response is: ",res.msg);
       $scope.parentSkuStatus=res.msg;
       if($scope.parentSkuStatus == "false") {
           console.log("parent sku false part");
             $scope.alerts.push({type: 'danger', message: 'Inventory Does Not Exists!\nCreate The Inventory! '});
					 console.log("sku status: ",$scope.parentSkuStatus);
					 parentSkuObj = parentSku;
					 $scope.parentSkuFalseCount=0;
					 console.log("perentskuObj: ",parentSkuObj);
           //$scope.alerts.push({type: 'success', message: 'Create the inventory first..!'});


       }else{
				 console.log("parent sku true part..");
				 $scope.parentSkuStatus=true;
         $scope.luxireStock=res;
				 $scope.parentSkuFalseCount=0;
				 console.log("+++++++++++++++++false count: "+$scope.parentSkuFalseCount);
				 parentSkuObj = $scope.luxireStock;
				 console.log("sku status: ",$scope.parentSkuStatus);
					console.log("luxire stock object: ",$scope.luxireStock);
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

		//console.log("modal return value is : \n\n",$scope.importModalValue);
		var len=JSON.stringify($scope.importModalValue).length;
		console.log("length: "+$scope.importModalValue.length);
		console.log("len: "+bytesToSize(len));
		var csvToJsonData = CSV2JSON($scope.importModalValue);
		console.log("csv to json file is: \n\n"+typeof(csvToJsonData));
		//console.log("file content: ",csvToJsonData);
		console.log("csv to json file is: \n\n"+typeof(JSON.parse(csvToJsonData)));
		var data=JSON.parse(csvToJsonData);

		csvFileUpload.uploadCsvFile(res).then(function(data) {
	    console.log("in import modal controller response is: ",data);

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
    console.log("modal count: "+$scope.modalCount);
    if($scope.modalCount>1){
			console.log("parent sku object: ",parentSkuObj);
      console.log("dummy data is : ",$scope.dummyInventoryData);
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'createProductInventoryModal.html',
        controller: 'createProductInventoryModalController',
        size: size,
        resolve: {
          luxireStock: function () {
            return { count:$scope.modalCount,data:$scope.dummyInventoryData, parent_sku_obj: parentSkuObj, sku_status:$scope.parentSkuStatus, falseCount: $scope.parentSkuFalseCount, };
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
      console.log("modal return value is : ",$scope.luxireStock);
			$scope.parentSkuFalseCount++;
      $scope.dummyInventoryData=$scope.luxireStock;
			console.log("dummy result: ",$scope.dummyInventoryData);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
  // --------------   END OF OPEN MODAL FUNCTIONALITY TO SHOW THE INVENTORY    ---------------


 // start of bind the all taxons value



 // end of bind the all taxons value


 // --------------   START OF CREATING THE PRODUCT STRUCTURE TO POST    ---------------

    $scope.checkShippingCatgoryId = function(shippingId){ // 23rd march changes: add this function
      console.log("checkShippingCatgoryId is calling...");
      $scope.shipping_emp_msg = false;
      console.log("checkShippingCatgoryId: ",shippingId);
      if(shippingId == '' || shippingId == undefined){
        $scope.shipping_emp_msg = true;
      }else{
        $scope.shipping_emp_msg = false;
      }
    }
  	$scope.createProduct = function() {
        // start: 18th march change: put validation for mandatory fields
        var empty_state_flag = 0;
        //console.log("product name: "+$scope.product.name);
      //   if(($scope.product.name == '' || $scope.product.name == undefined )
      //   || ($scope.luxireProduct.parent_sku == '' || $scope.luxireProduct.parent_sku == undefined)
      //   || ($scope.product.shipping_category_id == '' || $scope.product.shipping_category_id == undefined)
      //   || ($scope.product.price == '' || $scope.product.price == undefined)
      //   || ($scope.luxireProduct.luxire_product_type_id == undefined || $scope.luxireProduct.luxire_product_type_id == '')
      //   || ($scope.luxireProduct.luxire_vendor_master_id == undefined || $scope.luxireProduct.luxire_vendor_master_id == '')
      // ){
      //       console.log("need to fill the mandatory fields...");
      //        $scope.alerts.push({type: 'danger', message: 'Mandatory fields are empty..!'});
      //       return;
      //   }
      if(!empty_state_flag){
    //($scope.product.name == '' || $scope.product.name == undefined )
    //   || ($scope.luxireProduct.parent_sku == '' || $scope.luxireProduct.parent_sku == undefined)
    //   || ($scope.product.shipping_category_id == '' || $scope.product.shipping_category_id == undefined)
    //   || ($scope.product.price == '' || $scope.product.price == undefined)
    //   || ($scope.luxireProduct.luxire_product_type_id == undefined || $scope.luxireProduct.luxire_product_type_id == '')
    //   || ($scope.luxireProduct.luxire_vendor_master_id == undefined || $scope.luxireProduct.luxire_vendor_master_id == '')
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
          //  if($scope.product.is_gift_card == undefined || $scope.product.is_gift_card== ''){
          //   $scope.alerts.push({type: 'danger', message: 'Gift Card Can Not Be Empty !'});
          //   document.getElementById('giftcard').focus();
          //   return;
          // }
          empty_state_flag = 1;



    }
        if(empty_state_flag){ // 21st march
        // end: 18th march change: put validation for mandatory fields


        console.log("inventory obj length: "+(JSON.stringify($scope.luxireStock).length));
        var tagarr=[];
        if( $scope.selectedTagsArr == undefined || $scope.selectedTagsArr.length == 0 ){

        }else{
          for(i=0;i<$scope.selectedTagsArr.length;i++){
            tagarr[i]=$scope.selectedTagsArr[i].text;
          }
          console.log("color tags arr values are: \n",tagarr.toString());
        }

        var colorArr=[];
        if($scope.selectedColorArr == undefined || $scope.selectedColorArr.length == 0 ){

        }else{
          for(i=0;i<$scope.selectedColorArr.length;i++){
            colorArr[i]=$scope.selectedColorArr[i].text;
          }
          console.log("color tags arr values are: \n",colorArr.toString());
        }

        var seasonArr=[];
        if( $scope.selectedSeasonArr == undefined || $scope.selectedSeasonArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedSeasonArr.length;i++){
            seasonArr[i]=$scope.selectedSeasonArr[i].text;
          }
          console.log("color tags arr values are: \n",seasonArr.toString());
        }
        var usageArr=[];
        if( $scope.selectedUsageArr == undefined || $scope.selectedUsageArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedUsageArr.length;i++){
            usageArr[i]=$scope.selectedUsageArr[i].text;
          }
          console.log("color tags arr values are: \n",usageArr.toString());
        }
        var washCareArr=[];
        if( $scope.selectedWashCareArr == undefined || $scope.selectedWashCareArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedWashCareArr.length;i++){
            usageArr[i]=$scope.selectedWashCareArr[i].text;
          }
          console.log("color tags arr values are: \n",washCareArr.toString());
        }
        var salesPitchArr=[];
        if( $scope.selectedSalesPitchArr == undefined || $scope.selectedSalesPitchArr.length == 0){

        }else{
          for(i=0;i<$scope.selectedSalesPitchArr.length;i++){
            salesPitchArr[i]=$scope.selectedSalesPitchArr[i].text;
          }
          console.log("color tags arr values are: \n",salesPitchArr.toString());
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
  				console.log("create product true part...");
          // merge all the three product structure
  				$scope.postProductData={};
  				$scope.product["luxire_product_attributes"] = {};
          $scope.product["taxon_ids"] = $scope.taxon_ids;
  				$scope.product["luxire_product_attributes"]=$scope.luxireProduct;
  				$scope.product["luxire_product_attributes"]["luxire_stock_id"] = $scope.luxireStock.id;
  				//$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;
  				$scope.postProductData["product"]=$scope.product;
  				console.log("inventory id: "+$scope.luxireStock.id);
  				console.log(" create product true part\n before posting the product data is: ",JSON.stringify($scope.postProductData));
          // first create product functionality is invoked
        	products.createProduct($scope.postProductData).then(function(data){

            console.log("\n\ncreated product  id is: \n\n",data.master.id);
            products.update_image($scope.style_image,data.master.id).then(function(data){
                  console.log("in products.update image image data:",$scope.style_image);
                  console.log("update image upload"); // 30th march
            },function(error) {
               console.log(error);

             });
            // creating structure of adding the variants
            $scope.pid=data.id;
            var variants = {
                "variant":{
                "sku": "swt_"+$scope.product.sku,
                "price": $scope.swatchPrice
              }
            };

            console.log("variant object is: ",variants);
            console.log("pid: ",$scope.pid);
            // creating the varints
            products.createVariants(data.master.id,variants).then(function(data){
              // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

              //alert('variant is  successfully added');
              $scope.activeButton('products')
            }, function(info) {
              console.log(info);
            });

            var UpdatedVariantObj = {
              "variant": {
                "track_inventory": true
              }
            }
            console.log("product id: ",data.id);
            console.log("master id: ",data.master.id);
            products.updateVariants(data.id, data.master.id,UpdatedVariantObj).then(function(data){
              // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

              //alert('variant is  successfully updated');
              // $scope.activeButton('products');

            }, function(info) {
              console.log(info);
            });

            $scope.alerts.push({type: 'success', message: 'Product Created Successfully!'});
            $timeout(function(){
              console.timeEnd('timeout');
              $state.go('admin.product');

            }, 3000)

  		      // $scope.activeButton('products')
  		    }, function(info) {
  		      console.log("creating product error:\n\n",info);
  		    })
          // updating the inventory
  				products.updateStock($scope.luxireStock.id,$scope.luxireStock).then(function(data){
            // $scope.alerts.push({type: 'success', message: 'Stock updated successfully!'});

  		      //alert('inventory successfully updated');

  		      $scope.activeButton('products')
  		    }, function(info) {
  		      console.log(info);
  		    })




  		}else{ // creating product for non existing parent_sku
      console.log("product creation false part is calling...");
      console.log("parent sku: ",$scope.luxireProduct.parent_sku);
      console.log("luxire stock obj: ",$scope.luxireStock);
      $scope.luxireStock["parent_sku"]=$scope.luxireProduct.parent_sku;
      console.log("luxire stock length: ",JSON.stringify($scope.luxireStock).length);
      if (JSON.stringify($scope.luxireStock).length === 2) {
              console.log("luxire stock is empty...");
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
  		//$scope.product["luxire_product_attributes"]["luxire_product_type_id"] = productTypeId;

  		$scope.postProductData["product"]=$scope.product;

  		$scope.modalCount=0;
      var data=angular.toJson($scope.postProductData);
      console.log(" create product false part \nbefore posting the product data is: ",data);
      products.createProduct($scope.postProductData).then(function(data){
        console.log("after creation the product is ",data);
        // create the variant aftercreating the product

        console.log("\n\ncreated product  is: \n\n",data);
        console.log("\n\ncreated product  id is: \n\n",data.id);
        $scope.pid=data.id;
        var variants = {
            "variant":{
            "sku": "swt_"+$scope.product.sku,
            "price": $scope.swatchPrice
          }
        };
        console.log("variant object is: ",variants);
        console.log("pid: ",$scope.pid);
        products.createVariants(data.id,variants).then(function(data){
          // $scope.alerts.push({type: 'success', message: 'Variant created successfully!'});

          //alert('variant is  successfully added');
          $scope.activeButton('products')
        }, function(info) {
          console.log(info);
        })
          $scope.alerts.push({type: 'success', message: 'Product created successfully!'});
          $scope.activeButton('products');
        }, function(info) {
          console.log(info);
        })

      }
    }
  }// 21st march
}

  // --------------     END OF CREATING THE PRODUCT STRUCTURE TO POST    ---------------


	// $scope.showEditProducts=function(id){    // function redirect to product edit page
	//   console.log("selected inventory id:  "+id);
	//   $state.go("admin.edit_product",{id :id});
	// }
  //


});
